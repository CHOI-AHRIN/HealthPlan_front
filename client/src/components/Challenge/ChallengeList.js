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

    useEffect(() => {
        const token = cookie.load('token'); // 쿠키에서 토큰 가져오기
        if (token) {
            axios.post('http://localhost:8080/api/member/loginCookie', { token })
                .then(response => setCurrentUuid(response.data.uuid))
                .catch(error => console.error('토큰에서 아이디를 읽어올 수 없습니다:', error));
        }
        fetchChallenges();
    }, []);

    // 챌린지 목록 및 전체 페이지 수 설정
    const fetchChallenges = () => {
        axios.get(`http://localhost:8080/api/challenge/challengeList?searchType=${searchtype}&keyword=${keyword}`)
            .then(response => {
                const fetchedChallenges = response.data.clist;
                // 최신 순으로 정렬
                const sortedChallenges = fetchedChallenges.sort((a, b) => new Date(b.wdate) - new Date(a.wdate));
                setChallenges(sortedChallenges);
                setTotalPages(Math.ceil(sortedChallenges.length / itemsPerPage));
            })
            .catch(error => console.error('챌린지 목록을 가져오는 중 오류:', error));
    };

    // 현재 페이지에 맞는 챌린지 목록 슬라이스
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

    const handleSearchTypeChange = (e) => {
        setSearchtype(e.target.value);
    };

    const handleSearchValChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearchButtonClick = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchChallenges();
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
            </article>
        </section>
    );
}

export default ChallengeList;
