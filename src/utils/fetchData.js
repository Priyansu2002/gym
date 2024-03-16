export const exerciseOptions = {
  method: "GET",
  url: "https://exercisedb.p.rapidapi.com/exercises",
  params: { limit: "10" },
  headers: {
    "X-RapidAPI-Key": "6697ee2933msh7fb84a9dbb9507bp10525cjsn47ba56c1f29e",
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    // "X-RapidAPI-Key": "7f816baf16mshd05c209c6e8bc8dp1f25e9jsn605276e2bc49",
    // "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
  },
};

export const youtubeOptions = {
  method: "GET",

  headers: {
    "X-RapidAPI-Key": "6697ee2933msh7fb84a9dbb9507bp10525cjsn47ba56c1f29e",
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    // "X-RapidAPI-Key": "7f816baf16mshd05c209c6e8bc8dp1f25e9jsn605276e2bc49",
    // "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
  },
};

export const fetchData = async (url, options) => {
  const respose = await fetch(url, options);
  const data = await respose.json();

  return data;
};
