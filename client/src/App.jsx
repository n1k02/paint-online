import './styles/app.scss'
import Toolbar from "./components/Toolbar";
import SettingsBar from "./components/SettingsBar";
import Canvas from "./components/Canvas";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path={'/:id'} element={
                        <>
                            <div className={'toolbar'}>
                                <Toolbar/>
                                <SettingsBar/>
                            </div>
                            <Canvas/>
                        </>
                    }/>
                    <Route path={'/'} element={
                        <Navigate to={`f${(+new Date).toString(16)}`}/>
                    }/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
