export class FrameTimer {
    static lastFrameTime: any = {}
    static isNewFrame(id: string): boolean {
        let currTime = Date.now()
        let lastFrameTime: number = this.lastFrameTime[id]
        if(!lastFrameTime) {
            this.lastFrameTime[id] = currTime
            return true
        }
        if(lastFrameTime + 16 < currTime) {
            this.lastFrameTime[id] = Math.max(lastFrameTime + 16, currTime - 16)
            return true
        } else {
            return false
        }
    }
}