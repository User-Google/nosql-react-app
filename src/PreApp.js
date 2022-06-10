import React, {useState} from "react";
import { BrowserRouter as  Router, Route, Switch, IndexRoute } from "react-router-dom";
import { Button, Tooltip, Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import MainPage from "./Pages/MainPage";

function PreApp(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
    props.setUserState(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const logOut = () => {
    setIsModalVisible(true);
  }
  
  return (
    <>
    <div className = "header">
      <div className = "nav">
        <h2 style = {{marginBottom: 0}}>Анализатор</h2>
        {/*<ul className = "navList">*/}
        {/*  <li className = "navItem"><a style = {{textDecoration:"none", color: "#000"}} href = "/">Главная</a></li>*/}
        {/*</ul>*/}
        <div style = {{display: 'flex'}}>
          <p style={{fontSize: 10, color: 'black', marginBottom: 0, marginRight: 10}}>Вы вошли, как {props.userState.login}</p>
          <Tooltip title="Выход">
            <Button
                onClick={logOut}
                size='small' shape="circle"
                style = {{backgroundColor: 'transparent'}}
                icon={<LogoutOutlined/>
                }/>
          </Tooltip>
        </div>
      </div>
    </div>
    <div className = "paddingBottom">
      {/*<Router>*/}
      {/*  <Switch>*/}
      {/*    <Route exact path = "/" component = {MainPage(props.userState)}/>*/}
      {/*  </Switch>*/}
      {/*</Router>*/}
        <MainPage userState={props.userState}/>
      </div>
      <Modal
          title="Подтвердите выход"
          visible={isModalVisible}
          onOk={handleOk} onCancel={handleCancel}
          okText={'Выйти'} cancelText={'Отмена'}
          width={400}
      >
        <p>Вы точно хотите выйти?</p>
        <p>Данные фильтров будут сброшены</p>
      </Modal>
    </> 
    );
}


export default PreApp;
