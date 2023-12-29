import PreferenceVoteContainer from "../components/PreferenceVote/PreferenceVoteContainer";
import news from "../news.json";
import { useState, useEffect } from "react";
import axios from "axios";

const Preference = ({data}) => {

  news.sort(() => Math.random() - 0.5);

  return (
    <div>
      {data && news && <PreferenceVoteContainer news={news} data={data} />}
    </div>
  );
};

export default Preference;
