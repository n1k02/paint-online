import Tool from "./Tool";

export default class Circle extends Tool {
    constructor(canvas) {
        super(canvas)
        this.listen()
    }

    listen () {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }
    mouseUpHandler(e) {
        this.mouseDown = false

    }
    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft
        this.startY = e.pageY - e.target.offsetTop
        this.saved = this.canvas.toDataURL()
    }
    mouseMoveHandler(e) {
        if(this.mouseDown) {
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            let currentX = e.pageX - e.target.offsetLeft
            let currentY = e.pageY - e.target.offsetTop
            let width = currentX - this.startX
            let height = currentY - this.startY
            let r = Math.max(Math.abs(width), Math.abs(height))
            this.draw(this.startX, this.startY, r, 0, 2 * Math.PI)
        }
    }
    draw (x,y, r, sAngle, eAngle, counterclockwise) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x,y,r, sAngle, eAngle, counterclockwise)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }
}