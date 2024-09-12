import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';

const NboardList = () => {

    const history = useHistory();

    const [append_NboardList, setAppend_NboardList] = useState([]);
    const [append_SboardList, setAppend_SboardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState('');
    const [startPage, setStartPage] = useState('');
    const [endPage, setEndPage] = useState('');
    const [keyword, setKeyword] = useState('');
    const [searchtype, setSearchtype] = useState('');


    useEffect(() => {
        callNboardListApi(currentPage);
        $("#spaging").hide();
    }, []);

    const callNboardListApi = (page) => {
        axios.get(`/api/nBoards/list/${page}`)
            .then(response => {
                try {
                    setAppend_NboardList(nBoardListAppend(response.data));
                    setTotalPages(response.data.pageMaker.totalPage);
                    setStartPage(response.data.pageMaker.startPage);
                    setEndPage(response.data.pageMaker.endPage);
                } catch (error) {
                    alert('작업중 오류가 발생하였습니다1.');
                }
            })
            .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
    };

    const nBoardListAppend = (nBoard) => {
        let result = []
        let nBoardList = nBoard.list

        for (let i = 0; i < nBoardList.length; i++) {
            let data = nBoardList[i]
            const formattedDate = new Date(data.regidate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).split('.').join('/').replace(/\s/g, '');

            const trimmedDate = formattedDate.slice(0, -1);

            result.push(
                <tr class="hidden_type">
                    <td>{data.bno}</td>
                    <td><Link to={`NboardRead/${data.bno}`}>{data.title}{data.replyCnt > 0 && `[${data.replyCnt}]`}</Link></td>
                    <td>{data.writer}</td>
                    <td>{data.viewCnt}</td>
                    <td>{trimmedDate}</td>
                </tr>
            )
        }
        return result;
    }

    const renderPagination = () => {
        const pagesPerGroup = 5;
        const pageNumbers = [];
        const currentPageGroup = Math.ceil(currentPage / pagesPerGroup);
        let startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
        let endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

        if (currentPageGroup > 1) {
            startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
            endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
        }

        for (let i = startPage; i <= endPage; i++) {
            const isCurrentPage = i === currentPage;
            pageNumbers.push(
                <button style={{ margin: 5, backgroundColor: isCurrentPage ? '#a4d1ae' : '' }}
                    className={`sch_bt99 wi_au ${isCurrentPage ? 'current-page' : ''}`} key={i} onClick={() => handlePageClick(i)}>
                    {i}
                </button>
            );
        };

        return (
            <div className="Paging">
                {currentPageGroup > 1 && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => handlePageClick(startPage - 1)}>
                        {'<'}
                    </button>
                )}
                {pageNumbers}
                {endPage < totalPages && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => handlePageClick(endPage + 1)}>
                        {'>'}
                    </button>
                )}
            </div>
        );
    }

    const callSboardListApi = (page) => {

        if (searchtype != '' && keyword != '') {
            axios.get(`/api/nBoards/list/${page}?searchType=${searchtype}&keyword=${keyword}`)
                .then(response => {
                    try {
                        setAppend_SboardList(sBoardListAppend(response.data));
                        setTotalPages(response.data.pageMaker.totalPage);
                        setStartPage(response.data.pageMaker.startPage);
                        setEndPage(response.data.pageMaker.endPage);
                        $("#cpaging").hide();
                        $("#spaging").show();
                    } catch (error) {
                        alert('작업중 오류가 발생하였습니다1.');
                    }
                })
                .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
        } else {
            history.goBack();
        };
    };

    const sBoardListAppend = (sBoard) => {
        let result = []
        let sBoardList = sBoard.list

        for (let i = 0; i < sBoardList.length; i++) {
            var data = sBoardList[i]
            const formattedDate = new Date(data.regidate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).split('.').join('/').replace(/\s/g, '');

            const trimmedDate = formattedDate.slice(0, -1);

            result.push(
                <tr class="hidden_type">
                    <td>{data.bno}</td>
                    <td><Link to={`NboardRead/${data.bno}`}>{data.title}{data.replyCnt > 0 && `[${data.replyCnt}]`}</Link></td>
                    <td>{data.writer}</td>
                    <td>{data.viewCnt}</td>
                    <td>{trimmedDate}</td>
                </tr>
            )
        }
        return result;
    }

    const renderSearchPagination = () => {
        const pagesPerGroup = 5;
        const pageNumbers = [];
        const currentPageGroup = Math.ceil(currentPage / pagesPerGroup);
        let startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
        let endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

        if (currentPageGroup > 1) {
            startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
            endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
        }

        for (let i = startPage; i <= endPage; i++) {
            const isCurrentPage = i === currentPage;
            pageNumbers.push(
                <button style={{ margin: 5, backgroundColor: isCurrentPage ? '#a4d1ae' : '' }}
                    className={`sch_bt99 wi_au ${isCurrentPage ? 'current-page' : ''}`} key={i} onClick={() => handlePageClick(i)}>
                    {i}
                </button>
            );
        };

        return (
            <div className="Paging">
                {currentPageGroup > 1 && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => handlePageClick(startPage - 1)}>
                        {'<'}
                    </button>
                )}
                {pageNumbers}
                {endPage < totalPages && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => handlePageClick(endPage + 1)}>
                        {'>'}
                    </button>
                )}
            </div>
        );
    };


    const handlePageClick = (page) => {
        if (keyword === '' || searchtype === '') {
            setCurrentPage(page);
            callNboardListApi(page);
        } else {
            setCurrentPage(page);
            callSboardListApi(page);
        }
    };

    const handleSearchValChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearchTypeChange = (e) => {
        setSearchtype(e.target.value);
    };

    const handleSearchButtonClick = (e) => {

        e.preventDefault();
        $("#appendNboardList").hide();
        setCurrentPage(1);
        callSboardListApi(1);

    };

    return (
        <section class="sub_wrap" >
            <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                <div class="li_top">
                    <h2 class="s_tit1">공 지 사 항</h2>
                    <div class="li_top_sch af">
                        <Link to={'/NboardRegister'} className="sch_bt2 wi_au">글쓰기</Link>
                    </div>
                </div>

                <div class="list_cont list_cont_admin">
                    <table class="table_ty1 ad_tlist">
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>조회수</th>
                            <th>작성일</th>
                        </tr>
                    </table>
                    <table id="appendNboardList" class="table_ty2 ad_tlist">
                        {append_NboardList}
                    </table>
                    <table id="appendSboardList" class="table_ty2 ad_tlist">
                        {append_SboardList}
                    </table>
                </div>
                <br></br>
                <div id="cpaging">
                    {renderPagination()}
                </div>
                <div id="spaging">
                    {renderSearchPagination()}
                </div>
                <br></br>
                <div className="searchingForm" >
                    <form onSubmit={(e) => handleSearchButtonClick(e)}>
                        <select value={searchtype} onChange={handleSearchTypeChange} className="searchzone">
                            <option value="">선택</option>
                            <option value="t">제목</option>
                            <option value="c">내용</option>
                            <option value="w">작성자</option>
                        </select>
                        <input className='search'
                            type="text"
                            placeholder="검색어를 입력해주세요."
                            value={keyword}
                            onChange={handleSearchValChange}
                        />
                        <button type="submit" className="sch_bt99 wi_au">검색</button>
                    </form>
                </div>
            </article>
        </section>
    );
}

export default NboardList;