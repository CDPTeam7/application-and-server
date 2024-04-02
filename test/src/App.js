import { useState, useEffect } from "react"; // react hook
import axios from "axios"; // api call
import { removeCookie, setCookie, getCookie } from "./Cookie";

axios.defaults.withCredentials = true; // Credentials 코드

export default function App() {
  const [Data1, setData1] = useState(undefined); // GetPoint용 state
  const [Data2, setData2] = useState(undefined); // AddPoint용 state
  const [LoginUser, setLoginUser] = useState({ id: "", pw: "" }); // Login용 state
  const [SignupUser, setSignupUser] = useState({ id: "", pw: "" }); // Signup용 state
  const [isAccessTokenVerify, setisAccessTokenVerify] = useState("");
  const [isrefreshTokenVerify, setisRefreshTokenVerify] = useState("");
  /*
   * Server에게 User의 Point가 얼마나 있는지에 대한 request를 보내는 함수
   */
  const GetPointFromServer = async () => {
    // 비동기로 실행
    // IP 주소로부터 api 얻어오기
    try {
      const response = await axios.post(
        // axios를 이용한 api call
        "/api/point/check", // 프록시
        //"http://127.0.0.1:5000/api/point/check", // 우선은 로컬로 실행
        //const response = await axios.post("http://3.37.36.180:5000/api/data", {
        {
          // 보낼 데이터
          name: "Elly",
        }
      );
      setData1(response.data.result_one); // state 변환
      console.log("Python 서버 응답:", response.data.result_one); // 디버깅용
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  /*
   * Server에게 User의 Point를 증가/감소시키는 것에 대한 request를 보내는 함수
   */
  const AddPointThroughServer = async () => {
    // 비동기로 실행
    // IP 주소로부터 api 얻어오기
    try {
      const response = await axios.post(
        // axios를 이용한 api call
        "/api/point/add", // 프록시
        //"http://127.0.0.1:5000/api/point/add", // 우선은 로컬로 실행
        //const response = await axios.post("http://3.37.36.180:5000/api/data", {
        {
          // 보낼 데이터
          name: "Abet",
          score: 10,
        }
      );
      setData2(response.data.result_one); // state 변환
      console.log("Python 서버 응답:", response.data.result_one); // 디버깅용
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  /*
   * Server에게 Login에 대한 request를 보내는 함수
   */
  const requestLogin = async (User) => {
    return await axios
      .post(
        "/api/auth/login",
        //"http://127.0.0.1:5000/api/auth/login",
        {
          user_id: User["id"],
          user_pw: User["pw"],
        },
        {
          "Content-Type": "application/json",
        }
      )
      .then((response) => {
        /// token이 필요한 API 요청 시 header Authorization에 token 담아서 보내기
        /*
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.access_token} ${response.data.refresh_token}`;
        */
        return response.data;
      })
      .catch((e) => {
        console.log(e.response.data);
        return "이메일 혹은 비밀번호를 확인하세요.";
      });
  };

  /*
   * Server에게 SignUp에 대한 request를 보내는 함수
   */
  const requestSignup = async (User) => {
    return await axios
      .post(
        "/api/auth/signup",
        //"http://127.0.0.1:5000/api/auth/signup",
        {
          user_id: User["id"],
          user_pw: User["pw"],
        },
        {
          "Content-Type": "application/json",
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((e) => {
        console.log(e.response.data);
        return "이메일 혹은 비밀번호를 확인하세요.";
      });
  };

  /*
   * Server에게 SignUp에 대한 request를 보내는 함수
   */
  const requestLogout = async () => {
    return await axios
      .post(
        "/api/auth/logout",
        //"http://127.0.0.1:5000/api/auth/logout",
        {
          access_token: await getCookie("accessToken"),
        },
        {
          "Content-Type": "application/json",
        }
      )
      .catch((e) => {
        console.log(e.response.data);
        return "이메일 혹은 비밀번호를 확인하세요.";
      });
  };

  /*
   * User가 Login button을 클릭했을 때를 handling하기 위한 함수
   */
  const handleLogin = async () => {
    const data = await requestLogin(LoginUser);
    //console.log(data);
    if (typeof data === String) {
      alert(data["msg"]);
    } else if (data["result"] === "fail") {
      alert(data["msg"]);
    } else {
      setCookie("accessToken", data.access_token);
      setCookie("refreshToken", data.refresh_token);
      alert("로그인에 성공하였습니다.");
      window.location.reload();
    }
  };

  /*
   * User가 Logout button을 클릭했을 때를 handling하기 위한 함수
   */
  const handleLogout = async () => {
    //console.log(getCookie("accessToken"));
    if (getCookie("accessToken") === undefined) {
      alert("비로그인 상태입니다. ");
    } else {
      requestLogout();
      removeCookie("accessToken");
      removeCookie("refreshToken");
      alert("로그아웃에 성공하였습니다.");
      window.location.reload();
    }
  };

  /*
   * User가 Signup button을 클릭했을 때를 handling하기 위한 함수
   */
  const handleSignup = async () => {
    const data = await requestSignup(SignupUser);
    //console.log(data);
    if (typeof data === String) {
      alert(data["msg"]);
    } else if (data["result"] === "fail") {
      alert(data["msg"]);
    } else {
      alert("회원가입에 성공하였습니다.");
      window.location.reload();
    }
  };

  /*
   * User가 Login의 text를 입력했을 때를 handling하기 위한 함수
   */
  const onChangeLogin = async (event) => {
    const { name, value } = event.target;
    setLoginUser({
      ...LoginUser,
      [name]: value,
    });
  };

  /*
   * User가 SignUp의 text를 입력했을 때를 handling하기 위한 함수
   */
  const onChangeSignup = async (event) => {
    const { name, value } = event.target;
    setSignupUser({
      ...SignupUser,
      [name]: value,
    });
  };

  const checkToken = async () => {
    return await axios
      .post(
        "/api/auth/checkToken",
        //"http://127.0.0.1:5000/api/auth/checkToken",
        {},
        {
          "Content-Type": "application/json",
        }
      )
      .then((response) => {
        console.log(response.data, response.data["access_token"]);
        setisAccessTokenVerify(response.data.result);
        setisRefreshTokenVerify(response.data.result);
        if (
          response.data["access_token"] !== null &&
          response.data["access_token"] !== undefined
        ) {
          setCookie("accessToken", response.data.access_token);
        }
      })
      .catch((e) => {
        console.log(e.response.data);
        return "이메일 혹은 비밀번호를 확인하세요.";
      });
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
    checkToken();
  }, []);

  return (
    <div>
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
      <div>
        <input
          onChange={onChangeLogin}
          name="id"
          type="text"
          placeholder="Enter ID"
        />
        <br />
        <input
          onChange={onChangeLogin}
          name="pw"
          type="password"
          placeholder="Enter Password"
        />
        <br />
        <button onClick={handleLogin}>LOGIN</button>
        <br />
        <button onClick={handleLogout}>LOGOUT</button>
        <br />
        <br />
        <input
          onChange={onChangeSignup}
          name="id"
          type="text"
          placeholder="Enter ID"
        />
        <br />
        <input
          onChange={onChangeSignup}
          name="pw"
          type="password"
          placeholder="Enter Password"
        />
        <br />
        <button onClick={handleSignup}>SIGNUP</button>
        <br />
        {getCookie("accessToken") !== undefined
          ? "access token: " + getCookie("accessToken")
          : "No access token"}
        <br />
        {getCookie("refreshToken") !== undefined
          ? "refresh token: " + getCookie("refreshToken")
          : "No refresh token"}
        <br />
        {isAccessTokenVerify}
        <br />
        {isrefreshTokenVerify}
      </div>
    </div>
  );
}
