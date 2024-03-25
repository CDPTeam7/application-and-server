import { useState, useEffect } from "react"; // react hook
import axios from "axios"; // api call

export default function App() {
  axios.defaults.withCredentials = true; // CORS 관련 Credentials 코드
  const [Data1, setData1] = useState(undefined); // GetPoint용 state
  const [Data2, setData2] = useState(undefined); // AddPoint용 state

  const GetPointFromServer = async () => {
    // 비동기로 실행
    // IP 주소로부터 api 얻어오기
    try {
      const response = await axios.post(
        // axios를 이용한 api call
        "http://127.0.0.1:5000/api/point/check", // 우선은 로컬로 실행
        //const response = await axios.post("http://3.37.36.180:5000/api/data", {
        {
          // 보낼 데이터
          name: "Elly",
        },
        { withCredentials: true } // Credentials 코드
      );
      setData1(response.data.result_one); // state 변환
      console.log("Python 서버 응답:", response.data.result_one); // 디버깅용
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  const AddPointThroughServer = async () => {
    // 비동기로 실행
    // IP 주소로부터 api 얻어오기
    try {
      const response = await axios.post(
        // axios를 이용한 api call
        "http://127.0.0.1:5000/api/point/add", // 우선은 로컬로 실행
        //const response = await axios.post("http://3.37.36.180:5000/api/data", {
        {
          // 보낼 데이터
          name: "Abet",
          score: 10,
        },
        { withCredentials: true } // Credentials 코드
      );
      setData2(response.data.result_one); // state 변환
      console.log("Python 서버 응답:", response.data.result_one); // 디버깅용
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  useEffect(() => {
    // componentdidmount나 constructor 용 hook - api call
    /*fetch("/users", { // fetch를 이용한 api call
      headers: {
        Accept: "application / json",
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        // 받아온 데이터를 data 변수에 update
        setData(data);
        console.log(data);
      })
      .catch((err) => console.log(err));*/
    GetPointFromServer(); // axios를 이용한 api call
    //AddPointThroughServer(); // axios를 이용한 api call
  }, []);

  return (
    <div>
      <h1>test 하는 중...</h1>
      <div>
        {typeof Data1 === "undefined" ? ( // 확인용 코드
          // fetch가 완료되지 않았을 경우에 대한 처리
          <h1>loading...</h1>
        ) : (
          <h1>{Data1.score}</h1>
        )}
      </div>
      <div>
        {typeof Data2 === "undefined" ? ( // 확인용 코드
          // fetch가 완료되지 않았을 경우에 대한 처리
          <h1>loading...</h1>
        ) : (
          <h1>{Data2.score}</h1>
        )}
      </div>
    </div>
  );
}
