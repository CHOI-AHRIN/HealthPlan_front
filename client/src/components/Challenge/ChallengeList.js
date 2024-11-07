import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import cookie from 'react-cookies';

const ChallengeList = () => {

    const [challenges, setChallenges] = useState([]); // 전체 챌린지 목록
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [currentUuid, setCurrentUuid] = useState(''); // 현재 로그인한 사용자의 UUID
    const itemsPerPage = 3; // 페이지당 항목 수
    const [keyword, setKeyword] = useState('');
    const [searchtype, setSearchtype] = useState('');
    const [rankingData, setRankingData] = useState('');

    useEffect(() => {
        const token = cookie.load('token'); // 쿠키에서 토큰 가져오기
        if (token) {
            axios.post('http://localhost:8080/api/member/loginCookie', { token })
                .then(response => setCurrentUuid(response.data.uuid))
                .catch(error => console.error('토큰에서 아이디를 읽어올 수 없습니다:', error));
        }
        fetchChallenges();
        //fetchMainChallenges();
    }, [searchtype, keyword, currentPage]);

    // 챌린지 랭킹
    useEffect(() => {
        // 댓글 수 상위 3명의 데이터를 가져오는 API 호출
        axios.get('http://localhost:8080/api/challenge/ranking')
            .then(response => {
                console.log(response.data); // rankingData 확인용 로그 추가
                if (Array.isArray(response.data)) {
                    setRankingData(response.data);
                } else if (response.data.rankingList) { // 예시로 rankingList라는 키에 배열이 있다고 가정
                    setRankingData(response.data.rankingList);
                }
                // setRankingData(response.data);
            })
            .catch(error => console.error('Error fetching ranking data:', error));
    }, []);



    // 챌린지 목록 및 전체 페이지 수 설정
    const fetchChallenges = () => {
        axios.get(`http://localhost:8080/api/challenge/challengeList?searchType=${searchtype}&keyword=${keyword}`)
            .then(response => {
                const fetchedChallenges = response.data.clist;
                console.log(fetchedChallenges); // 데이터가 모두 불러와지는지 확인
                // 최신 순으로 정렬
                const sortedChallenges = fetchedChallenges.sort((a, b) => new Date(b.wdate) - new Date(a.wdate));
                setChallenges(sortedChallenges);
                setTotalPages(Math.ceil(sortedChallenges.length / itemsPerPage));
            })
            .catch(error => console.error('챌린지 목록을 가져오는 중 오류:', error));
    };

    // 오늘의 챌린지
    const challengeListAppend = () => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        const currentChallenges = challenges.slice(startIdx, startIdx + itemsPerPage);

        return currentChallenges.map((data, index) => {
            const date = data.wdate;
            const year = date.substr(0, 4);
            const month = date.substr(5, 2);
            const day = date.substr(8, 2);
            const reg_date = `${year}.${month}.${day}`;

            // 현재 페이지와 항목 인덱스를 기반으로 순차적으로 번호를 표시
            const num = startIdx + index + 1;

            return (
                <tr className="hidden_type" key={data.bno}>
                    <td> {num} </td>
                    <td><Link to={`/ChallengeRead/${data.bno}`}>{data.title}{data.replycnt > 0 && `[${data.replycnt}]`}</Link></td>
                    <td> {data.uuid || '조회 중..'} </td>
                    <td> {data.bcounts} </td>
                    <td> {reg_date} </td>
                </tr>
            );
        });
    };

    // 랭킹 함수


    const challengeRankingAppend = () => {
        if (!rankingData || !Array.isArray(rankingData) || rankingData.length === 0) {
            return (
                <tr>
                    <td colSpan="5">데이터가 없습니다.</td>
                </tr>
            );
        }
        return rankingData.map((data, index) => (
            <tr key={`${data.MNO}-${index}`}>
                <td>{index + 1}</td> {/* 순위 */}
                <td>{data.MNO}</td> {/* 회원번호 */}
                <td>{data.UUID}</td> {/* 아이디 */}
                <td>{data.NAME}</td> {/* 이름 */}
                <td>{data.COMMENTCOUNT}</td> {/* 인증수 (댓글 수) */}
            </tr>
        ));
    };


    // 챌린지 랭킹
    /*     const challengRankAppend = () => {
            const startIdx = (currentPage - 1) * itemsPerPage;
            const currentChallenges = challenges.slice(startIdx, startIdx + itemsPerPage);
     
            return currentChallenges.map((data, index) => {
                const date = data.wdate;
                const year = date.substr(0, 4);
                const month = date.substr(5, 2);
                const day = date.substr(8, 2);
                const reg_date = `${year}.${month}.${day}`;
     
                // 현재 페이지와 항목 인덱스를 기반으로 순차적으로 번호를 표시
                const num = startIdx + index + 1;
     
                return (
                    <tr className="hidden_type" key={data.bno}>
                        <td> {num} </td>
                        <td> {data.mno}</td>
                        <td> {data.uuid || '조회 중..'} </td>
                        <td> {data.name} </td>
                        <td> {reg_date} </td>
                    </tr>
                );
            });
        };
     */


    const handleSearchTypeChange = (e) => {
        setSearchtype(e.target.value);
    };

    const handleSearchValChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearchButtonClick = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const renderSearchPagination = () => {
        const pageNumbers = [];
        const pagesToShow = 5; // 한 번에 보여줄 페이지 수

        // 페이지네이션 표시 범위 계산
        const startPage = Math.floor((currentPage - 1) / pagesToShow) * pagesToShow + 1;
        const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

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
                {totalPages > pagesToShow && startPage > 1 && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => handlePageClick(startPage - 1)}>
                        {'<'}
                    </button>
                )}
                {pageNumbers}
                {totalPages > pagesToShow && endPage < totalPages && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => handlePageClick(endPage + 1)}>
                        {'>'}
                    </button>
                )}
            </div>
        );
    };



    return (
        <section className="sub_wrap">
            <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                <div className="li_top">
                    <h2 className="s_tit1">챌린지</h2>
                </div>

                {/* 챌린지 공지사항 */}
                {/*  <h4 className="s_tit2">공지사항</h4>
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
                        {challengeMainAppend()}
                    </table>
                    <div id="spaging">
                        {renderMainPagination()}
                    </div>
                </div>

                {currentUuid === 'admin' && (
                    <div className="li_top_sch af">
                        <Link to={'/ChallengeInsert'} className="sch_bt2 wi_au">글쓰기</Link>
                    </div>
                )} */}

                {/* --------------------------------------------------------------------------------------------------------------------- */}


                <h4 className="s_tit2">오늘의 챌린지</h4>
                <div className="searchingForm">
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
                        {challengeListAppend()}
                    </table>
                    <div id="spaging">
                        {renderSearchPagination()}
                    </div>
                </div>

                {currentUuid === 'admin' && (
                    <div className="li_top_sch af">
                        <Link to={'/ChallengeInsert'} className="sch_bt2 wi_au">글쓰기</Link>
                    </div>
                )}

                {/* --------------------------------------------------------------------------------------------------------------------- */}

                {/* 챌린지 랭킹 */}
                <h4 className="s_tit2">챌린지 랭킹</h4>
                <div className="list_cont list_cont_admin">
                    <table className="table_ty1 ad_tlist2">
                        <thead>
                            <tr>
                                <th>순위</th>
                                <th>회원번호</th>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>인증수</th>
                            </tr>
                        </thead>
                        <tbody id="appendChallengeRanking" className="table_ty2 ad_tlist2" style={{marginTop: '10px'}}>
                            {rankingData && rankingData.length > 0 ? (
                                rankingData.map((data, index) => (
                                    <tr key={`${data.MNO}-${index}`}>
                                        <td>{index + 1}</td> {/* 순위 */}
                                        <td>{data.MNO}</td> {/* 회원번호 */}
                                        <td>{data.UUID}</td> {/* 아이디 */}
                                        <td>{data.NAME}</td> {/* 이름 */}
                                        <td>{data.COMMENTCOUNT}</td> {/* 인증수 (댓글 수) */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">데이터가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </article>
        </section>
    );
}

export default ChallengeList;
