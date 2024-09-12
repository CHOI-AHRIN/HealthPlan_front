import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'


const NboardModify = (props) => {

    let history = useHistory();

    const [bno] = useState(props.match.params.bno);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageDTOList, setImageDTOList] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [writer, setWriter] = useState();

    useEffect(() => {
        callNboardInfoApi();
        $('#articleNo').hide();
    }, [])


    const callNboardInfoApi = () => {
        axios.post('/api/nBoards/read', {
            bNo: bno
        })
            .then(response => {
                try {
                    setTitle(response.data.title);
                    setContent(response.data.content);
                    setWriter(response.data.writer);
                    setImageDTOList(response.data.imageDTOList);
                    setImageList(response.data.imageDTOList.map(image => ({
                        thumbnailURL: image.thumbnailURL
                    })));
                }
                catch (error) {
                    alert('게시글데이터 받기 오류')
                }
            })
            .catch(error => { alert('게시글데이터 받기 오류2'); return false; });

    }


    const renderImages = () => {

        return imageList.map((image, index) => (
            <li className="hidden_type" key={index}>
                <img
                    src={`/display?fileName=${image.thumbnailURL}`}
                    alt={`썸네일 ${index}`}
                />
            </li>
        ));
    };


    const submitClick = (type, e) => {

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
            jsonstr = decodeURIComponent(jsonstr);
            let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            let Json_data = {
                ...JSON.parse(Json_form),
                imageDTOList: imageDTOList,
            };

            axios.post('/api/nBoards/modify', Json_data)
                .then(response => {
                    try {
                        if (response.data == "succ") {
                            sweetalert('수정되었습니다.', '', 'success', '확인')
                            setTimeout(() => {
                                history.push(`/NboardRead/${bno}`);
                            }, 1500
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
        <section class="sub_wrap">
            <article class="s_cnt mp_pro_li ct1">
                <div class="li_top">
                    <h2 class="s_tit1">게 시 글 수 정</h2>
                </div>
                <div class="bo_w re1_wrap re1_wrap_writer">
                    <form name="frm" id="frm" action="" onsubmit="" method="post" >
                        <article class="res_w">
                            <div class="tb_outline">
                                <table class="table_ty1">
                                    <tr id="articleNo">
                                        <th>
                                            <label for="bNo">글번호</label>
                                        </th>
                                        <td>
                                            <input type="text" name="bNo" id="bNoVal" value={bno} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="title">제목</label>
                                        </th>
                                        <td>
                                            <input type="text" name="title" id="titleVal" defaultValue={title} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="Content">내용</label>
                                        </th>
                                        <td>
                                            <textarea style={{ padding: '15px' }} name="content" id="contentVal" rows="" cols="" defaultValue={content} ></textarea>
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
                                                {renderImages()}
                                            </ul>
                                        </td>
                                    </tr>

                                </table>
                                <div class="btn_confirm mt20" style={{ "margin-bottom": "44px", textAlign: "center" }}>
                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass"
                                        onClick={(e) => submitClick('file', e)}>저장</a>
                                    <Link to={`/NboardRead/${bno}`} className="bt_ty bt_ty2 submit_ty1 saveclass">취소</Link>
                                </div>
                            </div>
                        </article>
                    </form>
                </div>
            </article>
        </section>
    );
}

export default NboardModify;