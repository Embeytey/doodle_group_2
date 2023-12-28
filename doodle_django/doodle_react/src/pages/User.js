import UserContainer from "../components/User/UserContainer";
import news from "../news.json";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const User = () => {

  const { uuid } = useParams();

  const [data, setData] = useState([]);

  useEffect(() => {
    function getMeeting() {
      let url = "http://127.0.0.1:8000/api/meetings/";
      axios
        .get(url, { params: { link_token: uuid } })
        .then((response) => setData(response.data[0]))
        .catch((error) => console.log(error));
    }
    if(uuid){
      getMeeting();
    }
  }, [uuid]);

  return data && <UserContainer news={news} data={data} />;
};

export default User;
