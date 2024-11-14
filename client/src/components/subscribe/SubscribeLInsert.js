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
            axios.post('/api/member/loginCookie', { token })
                .then(response => {
                    const uuid = response.data.uuid;
                    if (uuid) {
                        axios.post('/api/member/read', { uuid })
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
        const spoint_checker = $('#spointVal').val();
        const content_checker = $('#contentVal').val();

        const fnValidate = (e) => {
            if (title_checker === '') {
                $('#titleVal').addClass('border_validate_err');
                sweetalert('제목을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#titleVal').removeClass('border_validate_err');

            if (spoint_checker === '') {
                $('#spointVal').addClass('border_validate_err');
                sweetalert('수강료를 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#spointVal').removeClass('border_validate_err');

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

            jsonstr = decodeURIComponent(jsonstr);
            let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";

            let Json_data = {
                ...JSON.parse(Json_form),
                imageDTOList: imageDTOList,
            };

            axios.post('/api/subscribe/subscribeLessionInsert', Json_data)
                .then(response => {
                    try {
                        if (response.data == "success") {
                            sweetalert('등록되었습니다.', '', 'success', '확인')
                            setTimeout(function () {
                                // history.push('/SubscribeLList');
                                navigate('/SubscribeLList');
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
        selected.imgType = "A";
        setSelectedFile(selected);
    }
    

    //대표이미지
    const handleFileInput2 = (type, e) => {
        const selected = e.target.files[0];
        $('#imagefile2').val(selected ? selected.name : '');
        selected.imgType = "M";
        setSelectedFile(selected);
    }

    useEffect(() => {
        if (selectedFile) {
            handlePostImage();
        }
    }, [selectedFile]);


    const handlePostImage = async () => {
        const formData = new FormData();
        const itype = selectedFile.imgType;
        formData.append('uploadFiles', selectedFile);

        try {
            const res = await axios.post("/api/supload/uploadAjax", formData);
            const { fileName, uuid, folderPath, imageURL, thumbnailURL, imgType } = res.data[0];

            setImageDTOList((prevImageDTOList) => [
                ...prevImageDTOList,
                { imgName: fileName, imageURL: imageURL, thumbnailURL: thumbnailURL, path: folderPath, uuid: uuid, imgType: itype },
            ]);

            const str = `<li data-name='${fileName}' data-path='${folderPath}' data-uuid='${uuid}' data-imgtype='${itype}' data-imageURL='${imageURL}'>
                            <img src='/api/supload/display?fileName=${thumbnailURL}'>
                          </li>`;
            if (itype == "M") {
                $('#upload_img2').append(str);
            } else {
                $('#upload_img').append(str);
            }
        } catch (error) {
            alert('작업 중 오류가 발생하였습니다. > handlePostImage');
        }
    }

    const handleRemoveAllThumbnails = () => {
        $('.fileBox1 ul').empty();
        $('#imagefile').val('');
        setImageDTOList([]);
    };

    const handleRemoveAllThumbnails2 = () => {
        $('.fileBox2 ul').empty();
        $('#imagefile2').val('');
        setImageDTOList([]);
    };


    return (
        <section className="sub_wrap">
            <article className="s_cnt mp_pro_li ct1">
                <div className="li_top">
                    <h2 className="s_tit1">강의등록</h2>
                </div>
                <div className="bo_w re1_wrap re1_wrap_writer">
                    <form name="frm" id="frm" action="" method="post" >
                        <article className="res_w">
                            <div className="tb_outline">
                                <table className="table_ty1">
                                    <tr>
                                        <th>
                                            <label for="writer">강의등록</label>
                                        </th>
                                        <td>
                                            <input type="text" name="uuid" id="uuid" readOnly="readonly" value={uuid} />
                                            <input type="hidden" name="mno" id="mno" value={mno} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            대표이미지
                                        </th>
                                        <td className="fileBox fileBox2">
                                            <label htmlFor='imageSelect2' className="btn_file">파일선택</label>
                                            <input type="text" id="imagefile2" className="fileName fileName1" readOnly="readonly" placeholder="선택된 파일 없음" />
                                            <input type="file" id="imageSelect2" className="uploadBtn uploadBtn1" onChange={e => handleFileInput2('file', e)} multiple />
                                            <button type="button" className='bt_ty2' style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10 }} onClick={handleRemoveAllThumbnails2}>X</button>
                                            <ul id="upload_img2">
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="title">강의제목</label>
                                        </th>
                                        <td>
                                            <input type="text" name="title" id="titleVal" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="spoint">수강료</label>
                                        </th>
                                        <td>
                                            <input type="text" name="spoint" id="spointVal" placeholder="숫자만 입력해주세요."/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="Content">강의내용</label>
                                        </th>
                                        <td>
                                            <textarea style={{ padding: '15px' }} name="contents" id="contentVal" rows="" cols=""></textarea>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            파일첨부
                                        </th>
                                        <td className="fileBox fileBox1">
                                            <label htmlFor='imageSelect' className="btn_file">파일선택</label>
                                            <input type="text" id="imagefile" className="fileName fileName1" readOnly="readonly" placeholder="선택된 파일 없음" />
                                            <input type="file" id="imageSelect" className="uploadBtn uploadBtn1" onChange={e => handleFileInput('file', e)} multiple />
                                            <button type="button" className='bt_ty2' style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10 }} onClick={handleRemoveAllThumbnails}>X</button>
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