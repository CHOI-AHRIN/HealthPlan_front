import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';

const ChallengeList = () => {

    //const history = useHistory();

    const [append_sChallengeList, setAppend_sChallengeList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState('');
    const [startPage, setStartPage] = useState('');
    const [endPage, setEndPage] = useState('');
    const [prev, setPrev] = useState('');
    const [next, setNext] = useState('');
    const [keyword, setKeyword] = useState('');
    const [searchtype, setSearchtype] = useState('');

    const [uuidMap, setUuidMap] = useState({});
    const [wuuid, setWuuid] = useState(''); // 게시글 작성자 아이디

    useEffect(() => {
        callChallengeListApi(currentPage);
    }, []);

    const callChallengeListApi = (page) => {
        axios.get(`http://localhost:8080/challenge/challengeList?page=${page}&searchType=${searchtype}&keyword=${keyword}`)
            .then(response => {
                try {
                    setAppend_sChallengeList(challengeListAppend(response.data));
                    setTotalPages(response.data.pageMaker.totalCount);
                    setStartPage(response.data.pageMaker.startPage);
                    setEndPage(response.data.pageMaker.endPage);
                    setPrev(response.data.pageMaker.prev);
                    setNext(response.data.pageMaker.next);


                    // API 응답에서 얻은 Challenge 데이터에 대해 UUID 조회
                    fetchUuids(response.data.clist);

                } catch (error) {
                    alert('작업중 오류가 발생하였습니다1.');
                }
            })
            .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
    };

    // mno로 uuid 조회
    const fetchUuids = async (challengeList) => {
        if (challengeList && challengeList.length > 0) {
            console.log("challengeListAppend, : ", challengeListAppend);

            // 각 챌린지의 mno에 대해 UUID 조회
            const requests = challengeList.map((challenge) =>
                axios.post('http://localhost:8080/member/getUuidByMno', { mno: challenge.mno })
            );

            try {
                const responses = await Promise.all(requests);
                console.log("응답 확인", responses); // 응답 확인용 콘솔 로그

                const uuidMapping = challengeList.reduce((acc, challenge, index) => {
                    console.log("응답에서 받은 uuid:", responses[index].data.uuid);
                    acc[challenge.mno] = responses[index].data.uuid; // mno에 해당하는 uuid 매핑
                    return acc;
                }, {});

                console.log("매핑된 uuidMap: ", uuidMapping); // uuidMap 확인
                setUuidMap(uuidMapping);  // 상태 업데이트

            } catch (error) {
                console.error('uuid 조회 중 오류 발생:', error);
            }
        }
    };
    /* 
    // mno로 uuid 조회 함수
    const getUuidByMno = (mno) => {
        axios.post('http://localhost:8080/member/getUuidByMno', { mno })
            .then(response => {
                // 서버에서 받은 uuid를 Wuuid 상태로 저장
                setWuuid(response.data.uuid); 
            })
            .catch(error => {
                console.error('UUID 조회 중 오류 발생:', error);
                alert('uuid 조회 중 오류 발생');
            });
    } */

    const challengeListAppend = (Challenge) => {
        let result = [];
        let ChallengeList = Challenge.clist;
        // alert("ChallengeList : " + ChallengeList);

        // 작성일(wdate)을 기준으로 내림차순 정렬
        // ChallengeList.sort((a, b) => new Date(b.wdate) - new Date(a.wdate));

        for (let i = 0; i < ChallengeList.length; i++) {
            let data = ChallengeList[i];

            var date = data.wdate;
            var year = date.substr(0, 4);
            var month = date.substr(5, 2);
            var day = date.substr(8, 2);
            var reg_date = year + '.' + month + '.' + day;

            var num = (Challenge.pageMaker.totalCount - (Challenge.pageMaker.cri.page - 1) * Challenge.pageMaker.cri.perPageNum - i);


            let uuid = uuidMap[data.mno] || '조회 중..';  // uuidMap에 없으면 '조회 중...' 표시


            result.push(
                <tr className="hidden_type">
                    {/* <td> {data.sno} </td> */}
                    <td> {num} </td>
                    <td><Link to={`/ChallengeRead/${data.bno}`}>{data.title}{data.replycnt > 0 && `[${data.replycnt}]`}</Link></td>
                    <td> {uuid} </td>
                    <td> {data.bcounts} </td>
                    <td> {reg_date} </td>
                </tr>
            )
        }
        return result;
    };

    const handleSearchTypeChange = (e) => {
        setSearchtype(e.target.value);
    };

    const handleSearchValChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearchButtonClick = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        callChallengeListApi(1);
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
        callChallengeListApi(page);
    };

    const renderSearchPagination = () => {
        const pageNumbers = [];

        for (let i = startPage; i <= endPage; i++) {
            const isCurrentPage = i === currentPage;
            pageNumbers.push(
                <button style={{ margin: 5, backgroundColor: isCurrentPage ? '#20217d' : '' }}
                    className={`sch_bt99 wi_au ${isCurrentPage ? 'current-page' : ''}`} key={i} onClick={() => handlePageClick(i)}>
                    {i}
                </button>
            );
        };

        return (
            <div className="Paging">
                {prev == true && (
                    <button style={{ margin: 5, backgroundColor: '#004AAD !important' }} className="sch_bt99 wi_au" onClick={() => handlePageClick(startPage - 1)}>
                        {'<'}
                    </button>
                )}
                {pageNumbers}
                {next == true && (
                    <button style={{ margin: 5, backgroundColor: '#004AAD' }} className="sch_bt99 wi_au" onClick={() => handlePageClick(endPage + 1)}>
                        {'>'}
                    </button>
                )}
            </div>
        );
    };

    return (
        <section className="sub_wrap" >
            <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                <div className="li_top">
                    <h2 className="s_tit1">챌린지</h2>
                </div>

                <div className="searchingForm" >
                    <form onSubmit={(e) => handleSearchButtonClick(e)}>
                        <select value={searchtype} onChange={handleSearchTypeChange} id="searchtype" className="searchzone">
                            <option value="total">전체</option>
                            <option value="TITLE">제목</option>
                            <option value="bcontents">내용</option>
                            <option value="uuid">작성자</option>
                        </select>
                        <input className='search' type="text" placeholder="검색어를 입력해주세요."
                            value={keyword} onChange={handleSearchValChange} />
                        <button type="submit" className="sch_bt99 wi_au">검색</button>
                    </form>
                </div>

                <div className="list_cont list_cont_admin">
                    <table className="table_ty1 ad_tlist">
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>조회수</th>
                            <th>작성일</th>
                        </tr>
                    </table>
                    <table id="appendChallengeList" className="table_ty2 ad_tlist">
                        {append_sChallengeList}
                    </table>
                    <div id="spaging">
                        {renderSearchPagination()}
                    </div>
                </div>

                <div className="li_top_sch af">
                    <Link to={'/ChallengeInsert'} className="sch_bt2 wi_au">글쓰기</Link>
                </div>
            </article>
        </section>
    );
}

export default ChallengeList;