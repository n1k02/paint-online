import React from 'react';
import '../styles/toolbar.scss'
import toolState from "../store/toolState";

const SettingsBar = () => {
    return (
        <div className={'toolbar__row settings-bar'}>
            <label htmlFor="{'line-width'}">Line width</label>
            <input
                id={'line-width'}
                style={{margin: '0 10px'}}
                type="number"
                defaultValue={1}
                min={1}
                max={50}
                onChange={e=> toolState.setLineWidth(e.target.value)}
            />
            <label htmlFor="{'stroke-color'}">Stroke color</label>
            <input
                id={'stroke-color'}
                style={{margin: '0 10px'}}
                type="color"
                defaultValue={1}
                min={1}
                max={50}
                onChange={e=> toolState.setStrokeColor( e.target.value)}
            />
        </div>
    );
};

export default SettingsBar;