import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

// useEffect → fetchMemberList 실행 → 멤버 데이터를 가져와 정렬 후 상태값 업데이트

const MemberList = () => {
    const [Members, setMembers] = useState([]); // 전체 멤버 목록
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const itemsPerPage = 10; // 페이지당 항목 수

    // 회원타입 변환 함수
    const displayMtype = (mtype) => {
        switch (mtype) {
            case 't':
                return '전문가';
            case 'm':
                return '일반회원';
            case 'a':
                return '운영자';
            default:
                return '알 수 없는 타입';
        }
    };

    // 전화번호 포맷 변환 함수
    const formatPhoneNumber = (phone) => {
        return phone.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
    };



    // 멤버 목록
    const fetchMemberList = () => {
        axios.get('/api/member/list')
            .then(response => {
                const fetchedMember = response.data;
                // 최신 순으로 정렬
                const sortedMember = fetchedMember.sort((a, b) => new Date(b.wdate) - new Date(a.wdate));
                setMembers(sortedMember);
                setTotalPages(Math.ceil(fetchedMember.length / itemsPerPage));
            })
            .catch(error => console.error('멤버 목록을 가져오는 중 오류:', error));
    };

    const memberListAppend = () => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        const currentMembers = Members.slice(startIdx, startIdx + itemsPerPage);

        return currentMembers.map((data, index) => {
            const date = data.regdate;
            const year = date.substr(0, 4);
            const month = date.substr(5, 2);
            const day = date.substr(8, 2);
            const reg_date = `${year}.${month}.${day}`;

            // 현재 페이지와 항목 인덱스를 기반으로 순차적으로 번호를 표시
            const num = startIdx + index + 1;
            return (
                <tr className="hidden_type" key={data.mno}>
                    <td style={{ width: '70px' }}>  {num} </td>
                    <td style={{ width: '80px' }} > {data.mno}</td>
                    <td style={{ width: '150px' }}>
                        <Link to={`/MemberModify/${data.uuid}`}>{data.uuid}</Link>
                    </td>
                    <td style={{ width: '150px' }} > {data.name} </td>
                    <td> {data.email} </td>
                    <td style={{ width: '170px' }}> {formatPhoneNumber(data.phone)} </td>
                    <td style={{ width: '150px' }}> {displayMtype(data.mtype)} </td>
                    <td style={{ width: '80px' }} > {data.sstype} </td>
                    <td style={{ width: '150px' }} > {reg_date} </td>
                </tr>
            );
        });
    };

    useEffect(() => {
        fetchMemberList();
    }, []);

    return (
        <section className="sub_wrap">
            <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                <div className="li_top">
                    <h2 className="s_tit1">회원목록</h2>
                </div>
                <div className="list_cont list_cont_admin">
                    <table className="table_ty1 ad_tlist2">
                        <tr>
                            <th style={{ width: '70px' }} >번호</th>
                            <th style={{ width: '80px' }} >회원번호</th>
                            <th style={{ width: '150px' }} >아이디</th>
                            <th style={{ width: '150px' }} >이름</th>
                            <th>이메일</th>
                            <th style={{ width: '170px' }}>연락처</th>
                            <th style={{ width: '150px' }}>회원타입</th>
                            <th style={{ width: '80px' }}>구독타입</th>
                            <th style={{ width: '150px' }}>회원가입일자</th>
                        </tr>
                    </table>
                    <table id="appendChallengeList" className="table_ty2 ad_tlist2">
                        {memberListAppend()}
                    </table>
                </div>
            </article>
        </section>
    );

}

export default MemberList;