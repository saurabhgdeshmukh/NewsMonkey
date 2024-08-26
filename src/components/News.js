

import React, {useEffect, useState} from 'react'

import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=>{
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 

    const updateNews = async () => {
        try {
            props.setProgress(10);
            const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=9477a1c86e74453fa5f1ec9cb877d9a0&page=${page}&pageSize=${props.pageSize}`; 
            setLoading(true);
            let data = await fetch(url);
            props.setProgress(30);
            let parsedData = await data.json();
            props.setProgress(70);
            setArticles(parsedData.articles || []);
            setTotalResults(parsedData.totalResults || 0);
            setLoading(false);
            props.setProgress(100);
        } catch (error) {
            console.error("Failed to fetch news articles:", error);
            setLoading(false);
        }
    };
    

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
        updateNews(); 
    }, [])


    const fetchMoreData = async () => {   
        console.log('Page:', page);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=9477a1c86e74453fa5f1ec9cb877d9a0&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1); 
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log('Parsed Data:', parsedData);
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);
    };
    
 
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinner />}
                <InfiniteScroll
                     dataLength={articles?.length || 0}
                     next={fetchMoreData}
                     hasMore={articles?.length !== totalResults}
                     loader={<Spinner />}
                > 
                    <div className="container">
                         
                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                    </div> 
                </InfiniteScroll>
            </>
        )
    
}


News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News