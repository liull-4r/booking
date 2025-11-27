<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Prevent redirects for API routes - let exception handler return JSON
        $middleware->redirectGuestsTo(function (Request $request) {
            // For API routes, return null to prevent redirect
            // This allows the AuthenticationException handler to catch it
            if ($request->is('api/*')) {
                return null;
            }
            // For web routes, you can set a login route if needed
            // return route('login');
            return null;
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Validation Exception Handler
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        // Model Not Found Exception Handler
        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found',
                ], 404);
            }
        });

        // Authentication Exception Handler
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            // Always return JSON for API routes
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated | Please login to continue',
                ], 401);
            }
            
          
        });

        // Authorization Exception Handler
        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized action | You do not have permission to perform this action.',
                    'status' => 403,
                ], 403);
            }
        });

        // Not Found HTTP Exception Handler
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Route not found. Please check the URL.',
                    'status' => 404,
                ], 404);
            }
        });

        // Method Not Allowed Exception Handler
        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Method not allowed for this route.',
                    'status' => 405,
                ], 405);
            }
        });
    })->create();
