import { React, useRef, useState, useEffect  } from "react";
import Axios from "axios";
import post_data from '../data/postOffice.json';
import CustomMap from "../Components/Map/customMap";
import Result from "../Components/Result/Result";
import Loader from "../Components/Loader/loader";
import { Button, Table, Modal, message } from 'antd';
import { DatePicker, Space } from 'antd';
import { Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

function handleChange(value) {
    console.log(`selected ${value}`);
}

const warning = () => {
    message.warning('Вы ввели не все данные!');
};

const loadJS = (id, url, location, onLoad) => {
  if (!document.getElementById(id)) {
    const scriptTag = document.createElement("script");
    location.appendChild(scriptTag);
    scriptTag.src = url;
    scriptTag.id = id;
    if (onLoad) {
      scriptTag.onload = onLoad;
    }
  }
};

function MainPage(props) {
  const [ parcels, setData ] = useState();
  const [ savedDots, setSavedDots ] = useState();
  const [isModalSavedDotVisible, setIsModalSavedDotVisibleVisible] = useState(false);
  const [ posts, setPost ] = useState(post_data);
  const [loading, setLoading] = useState(true);
  const [pmCoord, setPmCoord] = useState();
  const [filterDots, setFilterDots] = useState({
      startDate: '2021-06-30T20:00:01.000Z',
      endDate: '2021-11-21T20:00:01.000Z',
      longitude: null,
      latitude: null
  });

    useEffect(() => {
        Axios.get("http://localhost:3001/getSavedDots", {
            params: {
                login: props.userState.login
            }
        }).then((response) => {
            if (response.data) {
                setSavedDots(response.data);
            }
        });
    },[])

    useEffect(() => {
        console.log(savedDots);
    },[savedDots])

    const showModalSavedDot = () => {
        setIsModalSavedDotVisibleVisible(true);
    };

    const handleOkOnModalSavedDot = () => {
        setIsModalSavedDotVisibleVisible(false);
    };

    const handleCancelOnModalSavedDot = () => {
        setIsModalSavedDotVisibleVisible(false);
    };
    const onChangeDate = (date) => {
        if (date) {
            var startDate = date[0]._d.toISOString();
            console.log(startDate);
            var endDate = date[1]._d.toISOString();
            console.log(endDate);
            setFilterDots(prevState => ({
                ...prevState,
                startDate: startDate,
                endDate: endDate
            }));
        } else {
            console.log('empty data picker')
        }
    };
    useEffect(() => {
        console.log('filter changed');
    },[filterDots])

    const setSavedDot = (value) => {
        setFilterDots(prevState => ({
            ...prevState,
            latitude: value.getAttribute('latitude'),
            longitude: value.getAttribute('longitude')
        }));
        setPmCoord([value.getAttribute('latitude'), value.getAttribute('longitude')]);
        setIsModalSavedDotVisibleVisible(false);
    }

    const deleteSavedDot = (id) => {
        console.log(id)
        Axios.get("http://localhost:3001/deleteSavedDots", {
            params: {
                id: id
            }
        }).then((response) => {
            setSavedDots(
                savedDots.filter((val) => {
                    return val._id != id;
                })
            );
            console.log(response.data)
        });
    }


    const onClickButton = () => {
        if (filterDots.startDate &&
            filterDots.endDate &&
            filterDots.latitude &&
            filterDots.longitude) {
            Axios.get("http://localhost:3001/getDotsByRegion", {
                params: {
                    startDate: filterDots.startDate,
                    endDate: filterDots.endDate,
                    latitude: filterDots.latitude,
                    longitude: filterDots.longitude
                }
            }).then((response) => {
                if (response.data) {
                    setData(response.data);
                }
            });
        } else {
            warning();
        }
    }

    useEffect(() => {
        console.log('state data changed');
        hm.current ? hm.current.destroy() : console.log('');
        ymaps ? getHeatMap(ymaps) : console.log('');
    },[parcels])

  const [isModalDiagrammVisible, setIsModalDiagrammVisible] = useState(false);
  function showModalDiagramm() {
    setIsModalDiagrammVisible(true);
  };
  const handleCancel = () => {
    setIsModalDiagrammVisible(false);
  };

  const [ymaps, setYmaps] = useState(null);
  const [ref, setRef] = useState(null);

  function clickOnMap() {
      ref.events.add('click', function (e) {
          var coords = e.get('coords');
          var selectPlace = [coords[0], coords[1]]
          setFilterDots(prevState => ({
              ...prevState,
              latitude: coords[0],
              longitude: coords[1]
          }));
          setPmCoord(selectPlace)
      });
  }

  function initHeatMap (ymaps){
    loadJS(
      "Heatmap",
      "https://yastatic.net/s3/mapsapi-jslibs/heatmap/0.0.1/heatmap.min.js",
      document.head,
      () => getHeatMap(ymaps)
    );
  };
  const hm = useRef(null);

  function getHeatMap(ymaps){
    ymaps.ready(["Heatmap"]).then(function() {
      var data = [];

      for (var i = 0; i < parcels.length; i++) {
        data.push([parcels[i].latitude, parcels[i].longitude])
      };

      var heatmap = new ymaps.Heatmap(data, {
          radius: 15,
          dissipating: false,
          opacity: 0.8,
          intensityOfMidpoint: 0.2,
          gradient: {
              0.1: 'rgba(128, 255, 0, 0.7)',
              0.2: 'rgba(255, 255, 0, 0.8)',
              0.7: 'rgba(234, 72, 58, 0.9)',
              1.0: 'rgba(162, 36, 25, 1)'
          }
      });
      hm.current = heatmap;
      console.log(hm.current);
      // ref.geoObjects.add(hm.current)
      hm.current.setMap(ref);
  });
  }

  function setHeatMap(){
    if (hm.current){
      hm.current.setMap(ref);
    }
    else{
      initHeatMap(ymaps);
    }
  }

  function destroyHeatMap(){
    hm.current.destroy()
  }

  const hmIsShow = useRef(false);

    function toggleStateHeatMap(){
    if (hmIsShow.current){
      destroyHeatMap();
      hmIsShow.current = false;
    }
    else{
      setHeatMap();
      hmIsShow.current = true;

    }
  }

  return (
    <div className = "wrapper">
          {ref ? (null) : (<Loader/>)}
        <div className={'content'}>
          <CustomMap
            showModalDiagramm ={showModalDiagramm}
            parcels = {parcels}
            posts = {posts}
            ymaps = {ymaps}
            setYmaps = {setYmaps}
            refs = {ref}
            setRef = {setRef}
            setLoading = {setLoading}
            toggleStateHeatMap = {toggleStateHeatMap}
            clickOnMap = {clickOnMap}
            pmCoord = {pmCoord}
          />
            <div className={'rightSection'}>
                <div>
                    <RangePicker
                        onChange={onChangeDate}
                        defaultValue={[moment('2021-07-01', dateFormat), moment('2021-11-22', dateFormat)]}
                        showTime />
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                        <Button onClick = {onClickButton} style={{marginTop: 20}} type="primary" >Применить</Button>
                        <Button onClick = {showModalSavedDot} style={{marginTop: 20}} >Список сохраненных точек</Button>
                    </div>
                </div>
                {parcels ?
                    <Result
                        pmCoord = {pmCoord}
                        data={parcels}
                        userState={props.userState}
                        savedDots={savedDots}
                        setSavedDots={setSavedDots}
                    /> :
                    <h4 style={{marginTop: 20}}>Здесь будет отображен результат анализа больших данных</h4>}
            </div>

        </div>
        <Modal title="Сохранённые точки"
               visible={isModalSavedDotVisible}
               okButtonProps={{hidden: true}}
               onCancel={handleCancelOnModalSavedDot} cancelText={'Закрыть'}
        >
            {savedDots ? <div style={{height: 400, overflow: 'auto'}}>
                {savedDots.map(dot => {
                    return (
                        <div style={{
                            width: '100%',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            border: '1px solid grey',
                            marginBottom: 5,
                            padding: 5,
                        }}>
                            <h3>{dot.name}</h3>
                            <div>
                                <p>широта:</p>
                                <h6>{dot.latitude}</h6>
                                <p>долгота:</p>
                                <h6>{dot.longitude}</h6>
                            </div>
                            <div>
                                <Button
                                    latitude={dot.latitude}
                                    longitude={dot.longitude}
                                    onClick = {(e)=>setSavedDot(e.target.parentElement)} type="dashed">Выбрать</Button>
                                <Button idValue={dot._id}
                                        onClick = {(e)=>deleteSavedDot(e.target.parentElement.parentElement.getAttribute('idValue'))}
                                        icon={<DeleteOutlined />} type="dashed" danger/>
                            </div>
                        </div>
                    )
                })}
            </div> : null}
        </Modal>
          </div>
    );
}


export default MainPage;