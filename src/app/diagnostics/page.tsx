'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCorsProxyUrl, isUploadThingUrl, preloadImage } from "@/lib/image-utils";
import { logger } from "@/lib/logger";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Component that uses useSearchParams
function DiagnosticContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useKindeBrowserClient();
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const [authData, setAuthData] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Load image test from URL parameter
  useEffect(() => {
    const url = searchParams.get('url');
    if (url) {
      setImageUrl(url);
      testImageLoading(url);
    }
    
    // Set initial auth data
    setDebugInfo(prev => ({
      ...prev,
      auth: {
        isLoading: isAuthLoading,
        user: user ? {
          id: user.id,
          email: user.email,
          name: `${user.given_name || ''} ${user.family_name || ''}`.trim(),
        } : null,
      }
    }));
  }, [searchParams, user, isAuthLoading]);

  const testImageLoading = (url: string) => {
    setLoadStatus('loading');
    setErrorMessage(null);
    
    const info = {
      url,
      isUploadThingUrl: isUploadThingUrl(url),
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      userAgent: navigator.userAgent,
    };
    
    setDebugInfo(info);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setLoadStatus('success');
      setDebugInfo(prev => ({
        ...prev,
        dimensions: `${img.width}x${img.height}`,
        loadedAt: new Date().toISOString(),
      }));
    };
    
    img.onerror = (e) => {
      setLoadStatus('error');
      setErrorMessage('Image failed to load');
      console.error('Image loading failed:', e);
      
      setDebugInfo(prev => ({
        ...prev,
        errorTime: new Date().toISOString(),
        errorType: 'Image load failure',
      }));
      
      // Try with CORS proxy as a fallback
      testFallbackImage(url);
    };
    
    img.src = url;
  };
  
  const testFallbackImage = (url: string) => {
    logger.info('Testing fallback image loading', { source: 'diagnostics', meta: { url } });
    
    const corsUrl = getCorsProxyUrl(url);
    if (corsUrl === url) {
      // No CORS proxy available or needed
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setLoadStatus('success');
      setDebugInfo(prev => ({
        ...prev,
        fallbackSuccess: true,
        corsUrl,
        dimensions: `${img.width}x${img.height}`,
        loadedAt: new Date().toISOString(),
      }));
    };
    
    img.onerror = () => {
      setDebugInfo(prev => ({
        ...prev,
        fallbackSuccess: false,
        corsUrl,
      }));
    };
    
    img.src = corsUrl;
  };
  
  const checkAuthApi = async () => {
    setIsCheckingAuth(true);
    try {
      const response = await fetch('/api/diagnostics');
      const data = await response.json();
      setAuthData(data);
      logger.info('Auth diagnostic data', { source: 'diagnostics', meta: { authenticated: data.authenticated } });
    } catch (error) {
      logger.error('Error checking auth API', { source: 'diagnostics', meta: { error } });
      setAuthData({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsCheckingAuth(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Image Diagnostics</h1>
      
      {imageUrl ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
              <CardDescription>Testing image loading from: {imageUrl}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {loadStatus === 'loading' && (
                  <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
                )}
                
                {loadStatus === 'success' && (
                  <img 
                    src={imageUrl} 
                    alt="Test image" 
                    className="object-contain max-h-full"
                    crossOrigin="anonymous"
                  />
                )}
                
                {loadStatus === 'error' && (
                  <div className="text-red-500 text-center p-4">
                    <p className="font-bold">Error Loading Image</p>
                    <p className="text-sm mt-2">{errorMessage}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => testImageLoading(imageUrl)}
                disabled={loadStatus === 'loading'}
              >
                Retry Loading
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
              <CardDescription>Technical details about the image loading process</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-[400px]">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
              <Button variant="ghost" onClick={() => navigator.clipboard.writeText(JSON.stringify(debugInfo))}>
                Copy Debug Info
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Enter Image URL</CardTitle>
            <CardDescription>
              Provide a URL to diagnose image loading issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://utfs.io/your-image-url"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button 
                onClick={() => {
                  if (imageUrl) {
                    router.push(`/diagnostics?url=${encodeURIComponent(imageUrl)}`);
                  }
                }}
              >
                Test
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Main page component with Suspense
export default function DiagnosticPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    }>
      <DiagnosticContent />
    </Suspense>
  );
}
