<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Throwable
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            if ($exception instanceof \Illuminate\Database\QueryException) {
                $msg = $exception->getMessage();
                $isConnectionError = (strpos($msg, 'SQLSTATE[HY000]') !== false)
                    || (strpos($msg, 'could not find driver') !== false)
                    || (strpos($msg, 'No connection could be made') !== false)
                    || (strpos($msg, 'Access denied for user') !== false)
                    || (strpos($msg, 'Unknown database') !== false);

                $payload = [
                    'success' => false,
                    'message' => $isConnectionError
                        ? 'Database connection error. Please ensure the database server is running.'
                        : $msg,
                    'error'   => config('app.debug') ? $msg : null,
                ];

                if (config('app.debug') && method_exists($exception, 'getSql')) {
                    $payload['sql'] = $exception->getSql();
                    $payload['bindings'] = $exception->getBindings();
                }

                return response()->json($payload, 500);
            }

            if ($exception instanceof \Illuminate\Validation\ValidationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'The given data was invalid.',
                    'errors' => $exception->errors(),
                ], 422);
            }

            if ($exception instanceof \Illuminate\Auth\AuthenticationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Please login again.',
                ], 401);
            }

            if ($exception instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found.',
                ], 404);
            }
        }

        return parent::render($request, $exception);
    }
}
