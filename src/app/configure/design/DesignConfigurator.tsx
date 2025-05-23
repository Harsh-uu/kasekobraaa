"use client";

import HandleComponent from "@/components/HandleComponent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { RadioGroup } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/option-validator";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { BASE_PRICE } from "@/config/products";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig ,SaveConfigArgs } from "./actions";
import { useRouter } from "next/navigation";
import { getCorsProxyUrl, preloadImage } from "@/lib/image-utils";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

const colorClassMap = {
  'zinc-900': 'bg-zinc-900',
  'blue-950': 'bg-blue-950',
  'rose-950': 'bg-rose-950',
  'gray-200': 'bg-white'
} as const;

const borderClassMap = {
  'zinc-900': 'border-zinc-900',
  'blue-950': 'border-blue-950',
  'rose-950': 'border-rose-950',
  'gray-200': 'border-gray-200'
} as const;

const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) => {
  const { toast } = useToast();
  const router = useRouter();

  // State to track image loading status
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState(imageUrl);

  // Preload image and handle any CORS issues
  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsImageLoaded(false);
        const corsUrl = getCorsProxyUrl(imageUrl);
        setProcessedImageUrl(corsUrl);

        await preloadImage(corsUrl);
        console.log("Image preloaded successfully:", corsUrl);
        setIsImageLoaded(true);
      } catch (error) {
        console.error("Failed to preload image:", error);
        toast({
          title: "Image loading issue",
          description: "There was a problem loading your image. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadImage();
  }, [imageUrl, toast]);

  // Check if images are properly loaded in production
  useEffect(() => {
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Image URL:", imageUrl);
    console.log("Processed URL:", processedImageUrl);
  }, [imageUrl, processedImageUrl]);
  const {mutate: saveConfig, isPending} = useMutation({
    mutationKey: ["save-config"],    mutationFn: async (args: SaveConfigArgs) => {
      // First save the configuration to the database
      await _saveConfig(args);
      
      // Store config ID in both localStorage and sessionStorage for redundancy
      localStorage.setItem("lastConfigId", configId);
      sessionStorage.setItem("lastConfigId", configId);
      
      // Then process the image
      try {
        await saveConfiguration();
      } catch (error) {
        console.error("Error saving image configuration:", error);
        // Continue with redirect even if image processing fails
      }
    },
    onError: (error) => {
      console.error("Save config error:", error);
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive"
      });
    },    onSuccess: () => {
      console.log("Configuration saved successfully, redirecting to preview");
      // Use replace instead of push to avoid back button issues
      router.replace(`/configure/preview?id=${configId}`);
    }
  })

  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });

  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing("imageUploader");  async function saveConfiguration() {
    try {
      if (!phoneCaseRef.current || !containerRef.current) {
        console.error("DOM references not available");
        throw new Error("DOM references not available");
      }

      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get canvas context");
        throw new Error("Failed to get canvas context");
      }      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = processedImageUrl;
      
      console.log("Loading image from URL:", processedImageUrl);
      
      try {
        await new Promise((resolve, reject) => {
          userImage.onload = resolve;
          userImage.onerror = (e) => {
            console.error("Error loading image:", e);
            reject(new Error("Failed to load image"));
          };
          
          // Set a timeout in case the image hangs
          const timeout = setTimeout(() => {
            reject(new Error("Image loading timed out"));
          }, 10000); // 10 second timeout
          
          userImage.onload = () => {
            clearTimeout(timeout);
            resolve(null);
          };
        });
      } catch (error) {
        console.error("Image loading failed:", error);
        throw error;
      }

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });

      await startUpload([file], { configId });
    } catch (_err) {
      toast({
        title: "Something went wrong",
        description:
          "There was a problem saving your config, please try again.",
        variant: "destructive",
      });
    }
  }

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      <div
        ref={containerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 padding-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="phone-image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px bottom-px right-[3px] rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 left-[3px] bottom-px right-[3px] top-px rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          />
        </div>

        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });

            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderedPosition({ x, y });
          }}
          className="absolute z-20 border-[3px] border-primary"
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
        >          <div className="relative w-full h-full">
            {/* Use regular img tag instead of NextImage to avoid optimization issues in production */}
            <img
              src={processedImageUrl}
              alt="your image"
              className="pointer-events-none w-full h-full object-cover"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error("Image failed to load in component:", e);
                // Fallback to using NextImage if regular img fails
                e.currentTarget.style.display = "none";
                toast({
                  title: "Image display issue",
                  description: "There was a problem displaying your image. Please try refreshing.",
                  variant: "destructive",
                });
              }}
            />
          </div>
        </Rnd>
      </div>

      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
            aria-hidden="true"
          />

          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight font-bold text-3xl">
              Customize your case
            </h2>

            <div className="w-full h-px bg-zinc-200 my-6" />

            <div className="relative mt-4 h-full flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: val,
                    }));
                  }}
                >
                  <Label>Color : {options.color.label}</Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <RadioGroup.Option
                        key={color.label}
                        value={color}
                        className={({ active, checked }) =>
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                            {
                              [borderClassMap[color.tw]]: active || checked,
                            }
                          )
                        }
                      >
                        <span
                          className={cn(
                            colorClassMap[color.tw],
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>

                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            "flex text-sm gap-1 items-center cursor-default p-1.5 hover:bg-zinc-100",
                            {
                              "bg-zinc-100":
                                model.label === options.model.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({ ...prev, model }));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              model.label === options.model.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(val) => {
                        setOptions((prev) => ({ ...prev, [name]: val }));
                      }}
                    >
                      <Label>
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>
                      <div className="mt-3 space-y-4">
                        {selectableOptions.map((option) => (
                          <RadioGroup.Option
                            key={option.value}
                            value={option}
                            className={({ active, checked }) =>
                              cn(
                                "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between",
                                {
                                  "border-primary": active || checked,
                                }
                              )
                            }
                          >
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <RadioGroup.Label
                                  className="font-medium text-gray-900"
                                  as="span"
                                >
                                  {option.label}
                                </RadioGroup.Label>

                                {option.description ? (
                                  <RadioGroup.Description
                                    as="span"
                                    className="text-gray-500"
                                  >
                                    <span className="block sm:inline">
                                      {option.description}
                                    </span>
                                  </RadioGroup.Description>
                                ) : null}
                              </span>
                            </span>

                            <RadioGroup.Description
                              as="span"
                              className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                            >
                              <span className="font-medium text-gray-900">
                                {formatPrice(option.price / 100)}
                              </span>
                            </RadioGroup.Description>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  )
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-200" />
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center">
              <p className="font-medium whitespace-nowrap">
                {formatPrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100
                )}
              </p>              <Button
              isLoading={isPending} 
              disabled={isPending}
              loadingText="Saving"              onClick={() => {
                console.log("Continue button clicked, saving configuration");
                // Create a backup of the configuration ID for recovery if needed
                localStorage.setItem("lastConfigId", configId);
                sessionStorage.setItem("lastConfigId", configId);
                localStorage.setItem("configurationId", configId);
                sessionStorage.setItem("configurationId", configId);
                
                try {
                  saveConfig({
                    configId,
                    color: options.color.value,
                    finish: options.finish.value,
                    material: options.material.value,
                    model: options.model.value
                  });
                } catch (error) {
                  console.error("Error in saveConfig click handler:", error);
                  toast({
                    title: "Error saving configuration",
                    description: "Please try again or refresh the page.",
                    variant: "destructive"
                  });
                }
              }}
              size="sm" 
              className="w-full">
                Continue
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;
