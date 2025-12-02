
import Body from "./compoments/Body";
import {Provider} from "react-redux";
import appStore from './utlis/store/appStore';


function App() {
  return (
    <>
     <Provider store={appStore}>
      <Body/>
      </Provider> 
    </>
  );
}

export default App;
