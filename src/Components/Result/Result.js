import React, {useState, useRef} from "react";
import {Button, Modal, Input} from "antd";
import Axios from "axios";

function Result(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const textInput = useRef(null);

    function handleClick() {
        textInput.current.focus();
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        saveDot(props.pmCoord);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const saveDot = (record) => {
        Axios.get("http://localhost:3001/saveDot", {
            params: {
                name: textInput.current.state.value,
                latitude: record[0],
                longitude: record[1],
                login: props.userState.login
            }
        }).then((response) => {
            if (response.data) {
                props.setSavedDots([
                    ...props.savedDots,
                    {
                        name: textInput.current.state.value,
                        latitude: record[0],
                        longitude: record[1],
                        login: props.userState.login
                    },
                ]);
            }
        });
    }

    const countDist = (data) => {
        let dist = 0, cost = 0
        data.map(item => {
            dist += item.dist.calculated
            cost += item.dist.amount_charged
        })
        dist = Math.round(dist / data.length)
        cost = Math.round(cost / data.length)
        return dist.toString()
    }

    const countCost = (data) => {
        let cost = 0
        data.map(item => {
            cost += item.amount_charged
        })
        cost = Math.round(cost / data.length)
        return cost.toString()
    }

    const verdict = () => {}

    return (
        <div className={'resultContent'}>
            <h2>Результаты анализа</h2>
            {props.data.length !== 0 ? <div>
                <p style={{marginBottom: 10}}>В выбраном месте по результатам данных Яндекс.Еда на 2021 год было сделано:</p>
                <p style={{marginBottom: 10}}><span style={{fontSize: 20}}>{props.data.length}</span> заказов</p>
                <p style={{marginBottom: 10}}>Среднее расстояние до места доставки составляет:</p>
                <p style={{marginBottom: 10}}><span style={{fontSize: 20}}>{countDist(props.data)}</span> метров</p>
                <p style={{marginBottom: 10}}>Средняя стоимость заказа:</p>
                <p style={{marginBottom: 10}}><span style={{fontSize: 20}}>{countCost(props.data)}</span> рублей</p>
                {/*<p>Данное место рекомендуется для открытия ресторана, рассчитанного на доставку готовых блюд.</p>*/}
                <div style={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
                    <Button onClick = {showModal} >Сохранить точку</Button>
                </div>
            </div> : <p style={{color: 'red'}}>В области выбранного места нет ни одного заказа!</p>}
            <Modal
                title="Сохранение точки"
                visible={isModalVisible}
                okText={'Сохранить'} cancelText={'Отмена'}
                onOk={handleOk} onCancel={handleCancel}>
                <p>Придумайте короткое название для точки</p>
                <Input ref={textInput} placeholder="например: укажите улицу, район" />
            </Modal>
        </div>
    );
}

export default Result;
