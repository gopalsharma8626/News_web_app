import React, { Component } from 'react'
import Newsitem from './Newsitem'
import Spinner from './Spinner';
import PropTypes  from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
  static defaultProps ={
     country: 'in',
     pageSize: 6,
     category:'general',
  }
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number, 
    category: PropTypes.string,
  }
capitalizeFirstLetter = (string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalResults: 0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - Freeprass Today`;
    }
    async updateNews() {
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=58bbd702116247e2874fbe3c116d14a7&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        this.props.setProgress(30);
        let parsedata = await data.json();
        this.props.setProgress(70);
    
        this.setState({ articles: parsedata.articles ,
                        totalResults:parsedata.totalResults,
                        loading:false
                    })
                    this.props.setProgress(100);

    }
    async componentDidMount() {
        this.updateNews();
    }

    handlePrevClick = async () => {
        this.setState({ page: this.state.page - 1 });
        this.updateNews();
    }
    handleNextClick = async () => {
        this.setState({ page: this.state.page + 1 });
        this.updateNews()
    }
    fetchMoreData = async () => {  
        this.setState({page: this.state.page + 1})
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=58bbd702116247e2874fbe3c116d14a7&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parsedata = await data.json()
        this.setState({
            articles: this.state.articles.concat(parsedata.articles),
            totalResults: parsedata.totalResults
        })
      };
    
    render() {
        return (
            <>
                <h1 className='text-center' style={{margin: '2rem 0rem' ,marginTop:"3.5rem" }}>FreePress Today-Top {this.capitalizeFirstLetter(this.props.category)}  Headlines</h1>
                { this.state.loading && <Spinner/>}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    // loader={<Spinner/>}
                > 
                <div className='container'>
                <div className='row'>
                
                     { this.state.articles.map((element) => {
                        return <div className='col-md-4' key={element.url}>
                            <Newsitem title={element.title ? element.title:""} 
                            description={element.description?element.description : ""}
                            imageurl={element.urlToImage} newsurl={element.url}
                            author ={element.author} date={element.publishedAt} source={element.source.name}/>
                        </div>
                    })}
                </div>
                </div>
                </InfiniteScroll>
            </>

        )
    }
}

export default News

