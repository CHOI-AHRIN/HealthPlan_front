import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';
import Modal from 'react-modal';
// import moment from 'moment';
// import 'moment/locale/ko';

const SubscribeLRead = (props) => {
    const { sno } = useParams();

    const [memNickName] = useState(cookie.load('memNickName'));
    const [uuid, setUuid] = useState(''); // 로그인한 사용자의 uuid 
    const [mno, setMno] = useState(''); // 로그인한 사용자의 mno
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [writer, setWriter] = useState('');
    const [viewCnt, setViewCnt] = useState('');
    const [regidate, setRegidate] = useState('');
    const [imageDTOList, setImageDTOList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [append_ReplyList, setAppend_ReplyList] = useState([]);
    const [responseReplyList, setResponseReplyList] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [selectRno, setSelectRno] = useState('');

    const [uuidMap, setUuidMap] = useState({}); // mno와 uuid 매핑을 저장


    // 1. token에서 로그인한 사용자의 id 읽어오기
    useEffect(() => {
        const token = cookie.load('token'); // 쿠키에서 토큰 가져오기
        callReplyListApi(sno);

        if (token) {
            // 토큰을 서버에 보내서 로그인한 사용자의 uuid를 받아옴
            axios.post('/api/member/loginCookie', { token })
                .then(response => {
                    const userUuid = response.data.uuid; // 서버로부터 받아온 로그인한 사용자의 uuid
                    setUuid(userUuid);
                    // 회원 번호(mno)를 가져오기 위해 추가 요청
                    axios.post('/api/member/readMno', { uuid: userUuid })
                        .then(response => {
                            setMno(response.data.mno); // 회원 번호 상태 업데이트
                            callNboardInfoApi(userUuid); // 받아온 UUID를 기반으로 게시글 정보 요청
                        })
                        .catch(error => {
                            console.error('회원 번호를 가져오는 중 오류 발생:', error);
                        });
                })
                .catch(error => {
                    console.error('토큰에서 아이디를 읽어올 수 없습니다:', error);
                });
        }
    }, [sno]);

    useEffect(() => {
        console.log("uuidMap이 업데이트되었습니다:", uuidMap);
        setAppend_ReplyList(ReplyListAppend(responseReplyList));
    }, [uuidMap]);  // uuidMap이 변경될 때마다 댓글 목록을 다시 렌더링


    // 2. 댓글 목록에서 mno로 uuid 가져오기
    useEffect(() => {

        if (!responseReplyList || responseReplyList.length === 0) {
            console.log('댓글 데이터가 없습니다.');
            return;
        }


        console.log("responseReplyList 변경됨!!!! 2:", responseReplyList);


        const fetchUuids = async () => {
            if (responseReplyList && responseReplyList.length > 0) {
                console.log("fetchUuids 호출됨, responseReplyList:", responseReplyList);

                const requests = responseReplyList.map((data) =>
                    axios.post('/api/member/getUuidByMno', { mno: data.mno })
                );

                try {
                    const responses = await Promise.all(requests);
                    console.log("응답 확인", responses); // 응답 확인용 콘솔 로그

                    const uuidMapping = responseReplyList.reduce((acc, data, index) => {
                        console.log("응답에서 받은 uuid:", responses[index].data.uuid);
                        acc[data.mno] = responses[index].data.uuid; // mno에 해당하는 uuid 매핑
                        return acc;
                    }, {});

                    console.log("매핑된 uuidMap: ", uuidMapping); // uuidMap 확인
                    setUuidMap(uuidMapping); // 상태 업데이트

                } catch (error) {
                    console.error('UUID 조회 중 오류 발생:', error);
                }
            }
        };


        fetchUuids(); // 비동기 작업 호출
    }, [responseReplyList]); // responseReplyList가 변경될 때마다 실행



    // 2. 게시글 정보 API 호출, 게시글 작성자 UUID와 로그인한 사용자의 UUID를 비교
    const callNboardInfoApi = async () => {
        axios.get(`/api/subscribe/subscribeRead/${sno}`, {
            //sno: sno,
        }).then(response => {
            try {
                setTitle(response.data.title);
                setContent(response.data.contents);
                setWriter(response.data.uuid);
                setViewCnt(response.data.counts);
                setRegidate(response.data.wdate);
                setImageDTOList(response.data.imageDTOList);
            }
            catch (error) {
                alert('게시글데이터 받기 오류')
            }

        }).catch(error => { alert('게시글데이터 받기 오류2'); return false; });
    }



    // 3. 게시글 작성자와 로그인한 사용자의 UUID가 일치하면 수정/삭제 버튼을 보여줌
    const renderModifyDeleteButtons = () => {
        if (uuid === writer || uuid === 'admin') {
            return (
                <div id="modifyButton" className="btn_confirm mt20" style={{ marginBottom: '44px', textAlign: 'center' }}>
                    <Link to={`/SubscribeUpdate/${sno}`} className="bt_ty bt_ty2 submit_ty1 saveclass">수정</Link>
                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={deleteArticle}>삭제</a>
                </div>
            );
        }
        return null; // 작성자가 아니면 수정/삭제 버튼을 숨김
    };


    // 4. 댓글 작성자와 로그인한 사용자의 UUID가 일치하면 수정/삭제 버튼을 보여줌
    const renderReplyModifyDeleteButtons = (data) => {
        // data.replyer를 uuidMap에서 찾아서 현재 로그인한 uuid와 비교
        if (uuidMap[data.mno] && uuidMap[data.mno] === uuid) {
            return (
                <div>
                    <button className="catbtn bt_ty2 submit_ty1 saveclass" onClick={() => modifyComment(`${data.rno}`)}>수정</button>
                    {/*  <button className="catbtn bt_ty2 submit_ty1 saveclass" onClick={() => openEditModal(`${data.rno}`)}>모달</button> */}
                    <button className="catbtn bt_ty2 submit_ty1 saveclass" onClick={() => deleteComment(`${data.rno}`)}>삭제</button>
                </div>
            );
        }
        return null; // 작성자가 아니면 수정/삭제 버튼을 숨김
    };


    const handleThumbnailClick = (thumbnailURL) => {
        setModalIsOpen(true);
        setSelectedImage(thumbnailURL);
    };

    const closeImageModal = () => {
        setModalIsOpen(false);
        setSelectedImage('');
    };

    const renderImages = () => {
        const imageList = imageDTOList;

        return imageList.map((images, index) => (
            <li className="hidden_type" key={index}>
                <img
                    src={`/api/supload/display?fileName=${images.imgName}`}
                    alt={`썸네일 ${index}`}
                    onClick={() => handleThumbnailClick(images.imageURL)}
                />
            </li>
        ));
    };

    const deleteArticle = (e) => {
        sweetalertDelete1('삭제하시겠습니까?', () => {
            axios.delete(`/api/subscribe/subscribeDelete/${sno}`, {
                // sno: sno
            }).then(response => {

            }).catch(error => {
                alert('작업중 오류가 발생하였습니다.'); return false;
            });
        })
    };

    const sweetalertDelete1 = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    '삭제되었습니다.',
                    '',
                    'success'
                ).then(() => {
                    window.location.href = '/SubscribeList';
                });
            } else {
                return false;
            }
            callbackFunc();
        })
    }

    const submitClick = (e) => {
        const reply_checker = $('#replyTextVal').val();

        const fnValidate = (e) => {
            if (reply_checker === '') {
                $('#replyTextVal').addClass('border_validate_err');
                sweetalert('댓글내용을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#replyTextVal').removeClass('border_validate_err');
            return true;
        }

        if (fnValidate()) {

            // 폼 데이터를 객체로 수집
            const Json_data = {
                sno: $('#snoVal').val(),
                replyer: $('#replyerVal').val(),
                mno: mno,  // mno 값을 별도로 수집한 경우
                rcomment: $('#replyTextVal').val()
            };

            axios.post('/api/sreplies/add', Json_data)
                .then(response => {
                    try {
                        if (response.data == "SUCCESS") {
                            callReplyListApi(sno);
                            $('#replyTextVal').val('')
                        }
                    }
                    catch (error) {
                        alert('1. 작업중 오류가 발생하였습니다.')
                    }
                }).catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });
        }
    };

    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }

    const callReplyListApi = (sno) => {
        axios.get(`/api/sreplies/list/${sno}`)
            .then(response => {
                try {
                    setResponseReplyList(response.data);
                    setAppend_ReplyList(ReplyListAppend(response.data));
                } catch (error) {
                    alert('작업중 오류가 발생하였습니다1.');
                }
            })
            .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
    }

    const ReplyListAppend = (replyList) => {
        if (!replyList || replyList.length === 0) {
            return <li>댓글이 없습니다.</li>;
        }
        let result = []
        // const currentUser = '111';

        for (let i = 0; i < replyList.length; i++) {
            let data = replyList[i]
            const isCurrentUserCommentOwner = true;

            console.log("댓글에서 보여줄 내용:", data); // 댓글 목록 확인

            console.log("uuidMap 확인:", uuidMap);
            console.log("현재 mno 확인:", data.mno);
            // const isCurrentUserCommentOwner = data.replyer === currentUser;
            // const formattedDate = moment(data.regdate).fromNow();

            result.push(
                <li key={data.rno} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '19px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '80px' }}>
                            <img src={require(`../../img/댓글2.gif`)} alt="댓글 이미지" />
                        </div>
                        <div className="cat">
                            <p style={{ fontSize: '19px' }}>
                                {/* {data.replyer} */}
                                {uuidMap[data.mno] ? uuidMap[data.mno] : '아이디 누락'} {/* uuid 표시 */}
                                {data.mno}
                                <span style={{ fontSize: '12px' }}>
                                    <span style={{ marginLeft: '5px', color: 'grey' }}></span>
                                    <span style={{ fontSize: '10px', color: 'grey' }}></span>
                                </span>
                            </p>
                            <p style={{ color: '#525252' }}>{data.rcomment}
                                {/* <input type="text" value={data.rcomment} style={{ flex: '1', marginRight: '8px', height: '50px' }} /> */}
                            </p>
                        </div>
                    </div>
                    <div>
                        {renderReplyModifyDeleteButtons(data)}
                    </div>
                </li>
            );
        }
        return result
    }

    const deleteComment = (rno) => {
        sweetalertDelete2('삭제하시겠습니까?', () => {
            axios.delete(`/api/sreplies/delete/${rno}`, {
            }).then(response => {
                if (response.data == "SUCCESS") {
                    callReplyListApi(sno);
                }
            }).catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
        })
    };

    const sweetalertDelete2 = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                callbackFunc();
                //callReplyListApi(sno);
            } else {
                return false;
            }
        })
    }

    const modifyComment = (rno, rco) => {
        setIsEditModalOpen(true);
        setSelectRno(rno);
        setEditedContent(rco);
    };

    const openEditModal = (rno) => {
        this.setState({
            selectRno: rno,
            isEditModalOpen: true,
            editedContent: rno,
        });
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditedContent('');
    };

    const handleEditSubmit = () => {
        axios.put(`/api/sreplies/update/${selectRno}`, {
            rno: selectRno,
            rcomment: editedContent,
        }).then(response => {
            if (response.data == "SUCCESS") {
                setIsEditModalOpen(false);
                callReplyListApi(sno);
            }
        }).catch(error => { alert('댓글수정오류'); return false; });
    };

    const formattedRegidate = new Date(regidate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).split('.').join('/').replace(/\s/g, '');

    const trimmedRegidate = formattedRegidate.slice(0, -1);

    return (
        <section class="sub_wrap">
            <article class="s_cnt mp_pro_li ct1">
                <div class="li_top">
                    <h2 class="s_tit1">전문가구독</h2>
                </div>
                <div class="bo_w re1_wrap re1_wrap_writer">
                    <form name="frm" id="frm" action="" onsubmit="" method="post" >
                        <article class="res_w">
                            <div class="tb_outline">
                                <div style={{ textAlign: "Right" }}>
                                    <Link to={`/SubscribeList`} className="bt_ty bt_ty2 submit_ty1 saveclass">목록</Link>
                                </div>
                                <table class="table_ty1">
                                    <tr>
                                        <th>
                                            <label for="title">제목</label>
                                        </th>
                                        <td>
                                            <input type="text" name="title" id="titleVal" readOnly="readonly" value={title} />
                                        </td>
                                    </tr>
                                </table>
                                <table class="table_ty1">
                                    <tr>
                                        <th>
                                            <label for="writer">작성자</label>
                                        </th>
                                        <td>
                                            <input type="text" name="writer" id="writerVal" readOnly="readonly" value={writer} />
                                        </td>

                                        <th style={{ textAlign: "center" }}>
                                            <label for="regDate">작성일</label>
                                        </th>
                                        <td>
                                            <input type="text" name="regiDate" id="regiDateVal" readOnly="readonly" value={trimmedRegidate} />
                                        </td>

                                        <th style={{ textAlign: "center" }}>
                                            <label for="writer">조회수</label>
                                        </th>
                                        <td>
                                            <input type="text" name="viewCnt" id="viewCntVal" readOnly="readonly" value={viewCnt} />
                                        </td>
                                    </tr>
                                </table>
                                <table class="table_ty1">
                                    <tr>
                                        <th>
                                            <label for="Content">내용</label>
                                        </th>
                                        <td>
                                            <textarea style={{ padding: '15px' }} name="content" id="contentVal" rows="" cols="" readOnly="readonly" value={content}></textarea>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>
                                            파일목록
                                        </th>
                                        <td className="fileBox fileBox1">
                                            <ul id="upload_img">
                                                {renderImages()}
                                            </ul>
                                        </td>
                                    </tr>

                                    <Modal
                                        ariaHideApp={false}
                                        isOpen={modalIsOpen}
                                        onRequestClose={closeImageModal}
                                        contentLabel="썸네일 이미지"
                                        style={{
                                            overlay: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                            },
                                            content: {
                                                width: '75%',
                                                height: '75%',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                overflow: 'auto',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                            }
                                        }}>
                                        {selectedImage && (
                                            <img src={`/api/supload/display?fileName=${selectedImage}`} alt="선택한 썸네일" />
                                        )}
                                    </Modal>
                                </table>
                                {/* 조건에 맞으면 수정/삭제 버튼 표시 */}
                                {renderModifyDeleteButtons()}
                            </div>
                        </article>
                    </form>

                    <div className='table_ty99' style={{ marginTop: '50px' }}>댓글</div>

                    <form name="frm2" id="frm2" action="" onsubmit="" method="post">
                        <div className='line'></div>
                        <table class="table_ty1">
                            <tr id='snoDiv' style={{ display: 'none' }}>
                                <td>
                                    <input type="hidden" name="sno" id="snoVal" value={sno} readonly="readonly" />
                                </td>
                            </tr>
                            <tr id='replyerDiv'>
                                    <tr style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <th style={{ marginRight: '10px' }}>
                                            <label for="mno">회원번호</label>
                                        </th>
                                        <td style={{ flex: '1', marginRight: '10px' }}>
                                            <input type="text" name="mno" id="mno" readOnly="readonly" value={mno} style={{ width: '100%' }} />
                                        </td>

                                        <th style={{ marginLeft: '20px' }}>
                                            <label for="replyer">작성자</label>
                                        </th>
                                        <td style={{ flex: '1', marginRight: '10px' }}>
                                            <input type="text" name="replyer" id="replyerVal" readOnly="readonly" value={uuid} style={{ width: '100%' }} />
                                        </td>
                                    </tr>
                            </tr>
                            <tr>
                                <td style={{ display: 'flex', alignItems: 'center' }}>
                                    <label for="rcomment" style={{ marginRight: '135px' }}>댓글</label>
                                    <input type="text" name="rcomment" id="replyTextVal" placeholder='내용을 입력해주세요.' style={{ flex: '1', marginRight: '8px', height: '50px' }} />
                                    <a href="javascript:" className="bt_ty1 bt_ty3 submit_ty1 saveclass" onClick={(e) => submitClick(e)}>등록</a>
                                </td>
                            </tr>
                        </table>
                    </form>
                    <div id='replyarea'>
                        <ul>
                            {append_ReplyList}
                        </ul>
                    </div>
                </div>

                <Modal
                    ariaHideApp={false}
                    isOpen={isEditModalOpen}
                    onRequestClose={closeEditModal}
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        content: {
                            width: '30%',
                            height: '30%',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white'
                        }
                    }}>
                    <div id="replyDiv">
                        <h2>댓글 수정</h2>
                        <br></br>
                        <input className="input_2" style={{ height: '30%', width: '80%', padding: '15px', marginBottom: '20px' }}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)} ></input>
                        <br></br>
                        <div style={{ display: 'flex' }}>
                            <button className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={handleEditSubmit}>저장</button>
                            <button className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={closeEditModal}>취소</button>
                        </div>
                    </div>
                </Modal>
            </article>
        </section>
    );
}

export default SubscribeLRead;