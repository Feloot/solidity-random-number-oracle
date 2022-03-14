import * as fs from 'fs'

export default class Logs {
  stream

  constructor(fileNname: string) {
    this.stream = fs.createWriteStream(fileNname, {flags:'a'});
  }

  public write(text: string) : void {
    this.stream.write(new Date().toISOString() + " : " + text + "\n");
  }

  public close(): void {
    this.stream.end()
  }
}