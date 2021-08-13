export default class Cron {
  private readonly callback: () => void
  private timeout: NodeJS.Timeout | null

  public constructor(callback: () => void, minutesInterval: number) {
    this.timeout = null
    this.callback = () => {
      try {callback()}
      catch (error) {console.error('The Cron callback throw an error: ', error)}
      this.timeout = setTimeout(this.callback, minutesInterval * 60 * 1000)
    }
  }

  public start(): void {
    this.callback()
  }

  public stop(): void {
    if (this.timeout) clearTimeout(this.timeout)
  }
}
