function notFoundResponse(): Response {
  return new Response("404", {
    status: 404,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export const GET = notFoundResponse;
export const HEAD = notFoundResponse;
export const POST = notFoundResponse;
export const PUT = notFoundResponse;
export const PATCH = notFoundResponse;
export const DELETE = notFoundResponse;
export const OPTIONS = notFoundResponse;
