import { assert, expect, should } from "chai"

export const getEventByName = (receipt: any, name: string) : any => {  
  for (const event of receipt.events) {
    if (event.event == name)
      return event
  }

  return undefined
}

export const expectEventByName = (receipt: any, name: string) : void => {
  expect(getEventByName(receipt, name)).to.not.be.undefined
}