import { assert, expect, should } from "chai"

export const tryCatch = async (promise: any) : Promise<void> => {
  try {
      await promise;
      throw null;
  }
  catch (error) {
      assert(error, "Expected an error but did not get one");
  }
}