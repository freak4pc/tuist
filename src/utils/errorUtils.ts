export async function tryFunc<T>(
  func: () => Promise<T>
): Promise<
  { result: T; error: undefined } | { error: Error; result: undefined }
> {
  try {
    return { error: undefined, result: await func() };
  } catch (e: any) {
    return { error: e, result: undefined };
  }
}
