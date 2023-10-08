import React, {useEffect, useRef, useState} from 'react';
import '../styles/canvas.scss'
import {observer} from "mobx-react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {Button, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";
import Rect from "../tools/Rect";
import axios from "axios";
import Eraser from "../tools/Eraser";

const Canvas = observer(() => {

    const canvasRef = useRef()
    const usernameRef = useRef()
    const [modal, setModal] = useState(true)
    const params = useParams()

    useEffect(() => {
        // add canvas to state
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        // get current draw by session id
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                if(response.status === 200) {
                    const img = new Image()
                    img.src = response.data
                    img.onload = () => {
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                    }
                }
            })
            .catch(e => console.log(e))
    }, []);

    useEffect(() => {
        if(canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000/')
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))

            socket.onopen = () => {
                console.log('connection established')
                socket.send(JSON.stringify({
                    id:params.id,
                    username: canvasState.username,
                    method: 'connection'
                }))
            }
            socket.onmessage = (e) => {
                let msg = JSON.parse(e.data)
                switch (msg.method) {
                    case 'connection' :
                        console.log(`User ${msg.username} successfully connected`)
                        break
                    case 'draw' :
                        drawHandler(msg)
                        break
                }
            }
        }
    }, [canvasState.username]);

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.staticDraw(ctx, figure.x, figure.y, figure.color, figure.lineWidth)
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color )
                break
            case "erase":
                Eraser.draw(ctx, figure.x, figure.y)
                break
            case 'finish' :
                ctx.beginPath()
                break
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(response => console.log(response.data))
    }

    const connectionHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        setModal(false)
    }

    return (
        <div className={'canvas'}>

            <Modal show={modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter your name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={connectionHandler}>
                        Enter
                    </Button>
                </Modal.Footer>
            </Modal>

            <canvas ref={canvasRef} width={600} height={400} onMouseDown={()=> mouseDownHandler()}>
            </canvas>
        </div>
    );
});

export default Canvas;