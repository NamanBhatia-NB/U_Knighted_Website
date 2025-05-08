import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
            The page you were looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex space-x-4 mt-4">
            <Link 
              href="/" 
              className="bg-primary dark:bg-accent text-white dark:text-primary hover:bg-primary/90 hover:text-white dark:hover:bg-accent/90 dark:hover:text-primary transition-all duration-200 px-4 py-2 rounded-md font-medium shadow-sm hover:shadow-md"
            >
              Go Home
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-100 transition-all duration-200 px-4 py-2 rounded-md font-medium"
            >
              Go Back
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
