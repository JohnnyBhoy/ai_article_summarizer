import { useEffect, useState } from "react";
import {copy, linkIcon, loader, tick} from '../assets';
import { useLazyGetSummaryQuery } from "../services/article";

function Demo() {
  const [article, setArticle] = useState({url: '',summary: ''});
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery();

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout( () => {
        setCopied(false);
    },2000)
  }

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'));

    if(articlesFromLocalStorage) {
        setAllArticles(articlesFromLocalStorage);
    }
  },[])

  const handleSubmit = async(e) => {
    e.preventDefault();
     const {data} = await getSummary({articleUrl: article.url});

     if(data?.summary){
        const newArticle = {...article, summary:data.summary};
        const udpatedArticles = [newArticle, ...allArticles];

        setArticle(newArticle);
        setAllArticles(udpatedArticles);

        localStorage.setItem('articles', JSON.stringify(udpatedArticles));

     }
  }

  const articles = allArticles.map(item => item.url != item.url);

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex
            justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link-icon"
            className="w-5 absolute left-0 my-2 ml-3"
          />
          <input
            type="url"
            placeholder="Enter a Url"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700
                peer-focus:text-gray-700"
          >
            »
          </button>
        </form>

        {/* Browse Url History*/}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {articles.map((item, index) => (
            <div
              key={`link=${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  className="w-[40%] h-[40%] object-contain"
                  alt="copy_icon"
                />
              </div>
              <p className="flex-1 font-semibold text-blue-700 font-satoshi">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Display results*/}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img
            src={loader}
            alt="loader"
            className="w-20 h-20 object-contains"
          />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Error loading results for this site, Please try another article
            site.<br/>
            <span className="font-satoshi font-normal text-gray-700">
                {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
                <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                    Article <span className="blue_gradient">Summary</span>
                </h2>
                <div className="summary_box">
                    <p className="text-justify font-medium font-inter text-gray-700 text-sm">{article.summary}</p>
                </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default Demo