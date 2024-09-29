import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';

const SubscribeLInsert = () => {

    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [imageDTOList, setImageDTOList] = useState([]);
    const [uuid, setUuid] = useState('');
    const [mno, setMno] = useState('');


    useEffect(() => {
        // token을 쿠키에서 가져와서 uuid를 받아오는 요청
        const token = cookie.load('token');
    
        if (token) {
            axios.post('http://localhost:8080/member/loginCookie', { token })
                .then(response => {
                    const uuid = response.data.uuid;
                    if (uuid) {
                        axios.post('http://localhost:8080/member/read', { uuid })
                            .then(response => {
                                const data = response.data;
                                setUuid(uuid);  // uuid 상태 값 설정
                                setMno(data.mno);  // mno 값 설정
                                // 'mno'가 상태로 업데이트된 후에 알림을 표시하기 위해, 업데이트된 값을 사용하도록 변경
                            })
                            .catch(error => {
                                console.error('회원 정보를 가져오는 중 오류 발생:', error);
                            });
                    } else {
                        console.error('아이디를 가져오는 데 실패했습니다.');
                    }
                })
                .catch(error => {
                    console.error('Token으로 아이디를 가져오는 요청 중 오류 발생:', error);
                });
        }
    }, []);


    const submitClick = async (type, e) => {

        const title_checker = $('#titleVal').val();
        const content_checker = $('#contentVal').val();

        const fnValidate = (e) => {
            if (title_checker === '') {
                $('#titleVal').addClass('border_validate_err');
                sweetalert('제목을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#titleVal').removeClass('border_validate_err');

            if (content_checker === '') {
                $('#contentVal').addClass('border_validate_err');
                sweetalert('내용을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#contentVal').removeClass('border_validate_err');

            return true;
        }

        if (fnValidate()) {
            let jsonstr = $("form[name='frm']").serialize();
            //alert(jsonstr);

            axios.post('http://localhost:8080/challenge/challengeinsert', jsonstr)
                .then(response => {
                    try {
                        if (response.data == "success") {
                            sweetalert('등록되었습니다.', '', 'success', '확인')
                            setTimeout(function () {
                                // history.push('/SubscribeLList');
                                navigate('/ChallengeList');
                            }, 1000
                            );
                        }
                    }
                    catch (error) {
                        alert('1. 작업중 오류가 발생하였습니다.')
                    }
                })
                .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });
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
    
    // 파일 선택 input의 값이 변경될 때 실행되는 메서드
    const handleFileInput = (type, e) => {
        const selected = e.target.files[0];
        $('#imagefile').val(selected ? selected.name : '');
        setSelectedFile(selected);
    }

    useEffect(() => {
        if (selectedFile) {
                handlePostImage();
            }
    }, [selectedFile]);
    

    const handlePostImage = async () => {
        const formData = new FormData();
        formData.append('uploadFiles', selectedFile);

        try {
            const res = await axios.post("/uploadAjax", formData);
            const { fileName, uuid, folderPath, thumbnailURL } = res.data[0];

            setImageDTOList((prevImageDTOList) => [
                ...prevImageDTOList,
                { imgName: fileName, path: folderPath, uuid: uuid },
            ]);

            const str = `<li data-name='${fileName}' data-path='${folderPath}' data-uuid='${uuid}'>
                            <img src='/display?fileName=${thumbnailURL}'>
                          </li>`;
            $('#upload_img').append(str);
        } catch (error) {
            alert('작업 중 오류가 발생하였습니다.');
        }
    }

    const handleRemoveAllThumbnails = () => {
        $('.fileBox1 ul').empty();
        $('#imagefile').val('');
        setImageDTOList([]);
    };

    return (
        <section className="sub_wrap">
            <article className="s_cnt mp_pro_li ct1">
                <div className="li_top">
                    <h2 className="s_tit1">챌린지 등록</h2>
                </div>
                <div className="bo_w re1_wrap re1_wrap_writer">
                    <form name="frm" id="frm" action="" method="post" >
                        <article className="res_w">
                            <div className="tb_outline">
                                <table className="table_ty1">
                                    <tr>
                                        <th>
                                            <label for="writer">작성자</label>
                                        </th>
                                        <td>
                                            {/* <input type="text" name="writer" id="writerVal" readOnly="readonly" value={memNickName} /> */}
                                            <input type="text"  id="writerVal" value={uuid} readonly="readonly"/>
                                            <input type="text" name="mno" id="" value={mno} readonly="readonly"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="title">제목</label>
                                        </th>
                                        <td>
                                            <input type="text" name="title" id="titleVal" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="Content">내용</label>
                                        </th>
                                        <td>
                                            <textarea style={{ padding: '15px' }} name="bcontents" id="contentVal" rows="" cols=""></textarea>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            파일첨부
                                        </th>
                                        <td className="fileBox fileBox1">
                                            <label htmlFor='imageSelect' className="btn_file">파일선택</label>
                                            <input type="text" id="imagefile" className="fileName fileName1"
                                                readOnly="readonly" placeholder="선택된 파일 없음" />
                                            <input type="file" id="imageSelect" className="uploadBtn uploadBtn1"
                                                onChange={e => handleFileInput('file', e)} multiple />
                                            <button type="button" className='bt_ty2' style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}
                                                onClick={handleRemoveAllThumbnails}>X</button>
                                            <ul id="upload_img">
                                            </ul>
                                        </td>
                                    </tr>

                                </table>
                                <div className="btn_confirm mt20" style={{ "margin-bottom": "44px", textAlign: "center" }}>
                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass"
                                        onClick={(e) => submitClick('file', e)}>저장 </a>
                                    <Link to={'/SubscribeLList'} className="bt_ty bt_ty2 submit_ty1 saveclass">취소</Link>
                                </div>
                            </div>
                        </article>
                    </form>
                </div>
            </article>
        </section>
    );
}

export default SubscribeLInsert;