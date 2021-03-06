import React from "react";
import { Placemark } from 'react-yandex-maps';
import myIcon from '../../../data/unnamed.png';

function SetPlacemarks(props) {
    return(
            <div>
                <Placemark
                geometry={props.pmCoord}
                // properties = {{
                //     hintContent: items.parcelno,
                //     balloonContent: items.propaddr
                // }}
                // modules = {
                //     ['geoObject.addon.balloon', 'geoObject.addon.hint']}
                options={{
                        iconLayout: 'default#image',
                        iconImageHref: myIcon,
                        iconImageSize: [36, 36],
                        iconImageOffset: [-18, -18]
                      }}
                />
            </div>
                
            
    )
}

export default SetPlacemarks;