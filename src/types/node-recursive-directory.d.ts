declare module 'node-recursive-directory' {
  function recursiveDirectory(
    dirPath: string,
    asObject: boolean = false
  ): Promise;

  export = getFile;
}
