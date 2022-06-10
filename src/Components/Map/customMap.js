import React from "react";
import { YMaps, Map, ZoomControl, Button, Circle } from 'react-yandex-maps';
import SetPlacemarks from './Placemark/setPlacemarks';
import SetPlacemarks_posts from './Placemark/setPlacemarks_posts';

const mapState = {
    center:  [53.219414, 50.190366],
    zoom: 10,
    controls: []
}


function CustomMap (props){

    return(
      <>
        <YMaps query={{ ns: "ymaps", apikey: '413dad6e-973a-4e11-8762-9dc7c6a6fb64', load: "package.full"}}>
            <Map 
              modules={["multiRouter.MultiRoute"]}
              onLoad={ymaps => props.setYmaps(ymaps)}
              state={mapState}
              // options = {{ minZoom: 10 }}
              instanceRef={ref => props.setRef(ref)}
              width = "70%" height='400px'
              onClick = {props.clickOnMap}
            >
            <Button onClick = {() => props.toggleStateHeatMap()} data = {{content: "HeatMap"}}/>
            {/*<Button onClick = {props.showModalDiagramm} */}
            {/*  options = {{selectOnClick: false}} */}
            {/*  data = {{image: "http://s1.iconbird.com/ico/0912/fugue/w16h161349012159chart.png",*/}
            {/*           title: "Диграмма распределения"}}*/}
            {/*/>*/}
              {/*<SetPlacemarks_posts data={props.posts} />*/}
                {props.pmCoord ? <SetPlacemarks data={props.parcels} pmCoord={props.pmCoord}/> : <></>}
              <ZoomControl options={{ float: 'right' }} />
            </Map>
        </YMaps>
        </>
    )
}

export default CustomMap;