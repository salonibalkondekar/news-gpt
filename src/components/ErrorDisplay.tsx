'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ApiError } from '@/types/news';

interface ErrorDisplayProps {
  error: ApiError;
  onRetry?: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">
          Unable to Fetch News
        </h3>
        
        <p className="text-gray-400 mb-6">
          {error.message}
        </p>
        
        <div className="space-y-3 text-sm text-gray-500">
          <p>💡 <strong>Running in Demo Mode</strong></p>
          <p>To get live news, add your OpenAI API key:</p>
          <ol className="text-left space-y-1 max-w-sm mx-auto">
            <li>1. Get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">OpenAI Platform</a></li>
            <li>2. Add it to your environment variables</li>
            <li>3. Restart the application</li>
          </ol>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="
              mt-6 px-6 py-3 bg-red-600 text-white rounded-lg
              hover:bg-red-700 transition-colors duration-200
              flex items-center gap-2 mx-auto
            "
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
