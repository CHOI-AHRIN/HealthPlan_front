import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'

const SubscribeLUpdate = (props) => {
    const navigate = useNavigate();

    const { sno } = useParams();
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageDTOList, setImageDTOList] = useState([]);
    const [mainImage, setMainImageList] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [imageMList, setMImageList] = useState([]);
    const [title, setTitle] = useState();
    const [spoint, setSpoint] = useState();
    const [imgType, setImgType] = useState();
    const [mno, setMno] = useState();
    const [content, setContent] = useState();
    const [writer, setWriter] = useState();



    useEffect(() => {
        callNboardInfoApi();
    }, [])


    const callNboardInfoApi = () => {
        axios.get(`/api/subscribe/subscribeLessionRead/${sno}`, {
        }).then(response => {
            try {
                setTitle(response.data.title);
                setSpoint(response.data.spoint);
                setMno(response.data.mno);
                setContent(response.data.contents);
                setWriter(response.data.uuid);
                setImgType(response.data.imgType);
                setImageDTOList(response.data.imageDTOList);
                setMainImageList(response.data.mainImage);
                setImageList(response.data.imageDTOList.map(image => ({
                    thumbnailURL: image.imgName
                })));
                setMImageList(response.data.mainImage.map(image => ({
                    thumbnailURL: image.imgName
                })));
            }
            catch (error) {
                alert('게시글데이터 받기 오류')
            }
        }).catch(error => { alert('게시글데이터 받기 오류2'); return false; });

    }

    // 썸네일 로딩
    const renderImages = () => {
        return imageList.map((image, index) => (
            <li className="hidden_type" key={index}>
                <img
                    src={`/api/supload/display?fileName=${image.thumbnailURL}`}
                    alt={`썸네일 ${index}`}
                />
            </li>
        ));
    };

    const renderMainImages = () => {
        const mainImgList = mainImage;

        return mainImgList.map((image, index) => (
            <li className="hidden_type1" key={index}>
                <img src={`/api/supload/display?fileName=${image.imgName}`}
                    alt={`썸네일 ${index}`} />
            </li>
        ));
    };


    const submitClick = (type, e) => {

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

            jsonstr = decodeURIComponent(jsonstr);
            let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            let Json_data = {
                ...JSON.parse(Json_form),
                imageDTOList: imageDTOList,
            };


            axios.put(`/api/subscribe/subscribeLessionUpdate`, Json_data)
                .then(response => {
                    try {
                        if (response.data == "success") {
                            sweetalert('수정되었습니다.', '', 'success', '확인')
                            setTimeout(() => {
                                navigate(`/SubscribeLRead/${sno}`);
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


    const handleFileInput = (type, e) => {
        const selected = e.target.files[0];
        $('#imagefile').val(selected ? selected.name : '');
        selected.imgType = "A";
        setSelectedFile(selected);
    }

    const handleFileInput2 = (type, e) => {
        const selected = e.target.files[0];
        $('#imageMainfile').val(selected ? selected.name : '');
        selected.imgType = "M";
        setSelectedFile(selected);
    }



    useEffect(() => {
        if (selectedFile) {
            handlePostImage(selectedFile.imgType);
        }
    }, [selectedFile]);


    const handlePostImage = async (type) => {
        const formData = new FormData();
        formData.append('uploadFiles', selectedFile);

        try {
            const res = await axios.post("/api/supload/uploadAjax", formData);
            const { fileName, uuid, folderPath, imageURL, thumbnailURL, imgType } = res.data[0];

            setImageDTOList((prevImageDTOList) => [
                ...prevImageDTOList,
                { imgName: fileName, imageURL: imageURL, thumbnailURL: thumbnailURL, path: folderPath, uuid: uuid, imgType: type },
            ]);

            const str = `<li data-name='${fileName}' data-path='${folderPath}' data-uuid='${uuid}' data-imgtype='${type}' data-imageURL='${imageURL}'>
                            <img src='/api/supload/display?fileName=${thumbnailURL}'>
                          </li>`;
            if (type == 'M') {
                $('#upload_MainImg').append(str);
            } else {
                $('#upload_img').append(str);
            }
        } catch (error) {
            alert('작업 중 오류가 발생하였습니다.');
        }
    }



    const handleRemoveAllThumbnails = (imgType) => {
        if (imgType == 'M') {
            $('.fileMainBox1 ul').empty();
            $('#imageMainfile').val('');
            setMainImageList([])
        } else {
            $('.fileBox1 ul').empty();
            $('#imagefile').val('');
            setImageDTOList([]);
        }
    };


    return (
        <section class="sub_wrap">
            <article class="s_cnt mp_pro_li ct1">
                <div class="li_top">
                    <h2 class="s_tit1">강의수정</h2>
                </div>
                <div class="bo_w re1_wrap re1_wrap_writer">
                    <form name="frm" id="frm" action="" onsubmit="" method="put" >
                        <article class="res_w">
                            <div class="tb_outline">
                                <table class="table_ty1">
                                    <tr id="articleNo">
                                        <th>
                                            <label for="sno">글번호</label>
                                        </th>
                                        <td>
                                            <input type="text" name="sno" id="snoVal" value={sno} readonly="readonly" />
                                            <input type="hidden" name="mno" id="mnoVal" value={mno} readonly="readonly" style={{ display: 'none' }} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            대표이미지
                                        </th>
                                        <td className="fileBox fileMainBox1">
                                            <label htmlFor='imageMainSelect' className="btn_file">파일선택</label>
                                            <input type="text" id="imageMainfile" className="fileName fileName1"
                                                readOnly="readonly" placeholder="선택된 파일 없음" />
                                            <input type="file" id="imageMainSelect" className="uploadBtn uploadBtn1"
                                                onChange={e => handleFileInput2('file', e)} multiple />
                                            <button type="button" className='bt_ty2' style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}
                                                onClick={() => handleRemoveAllThumbnails('M')}>X</button>
                                            <ul id="upload_MainImg">
                                                {renderMainImages()}
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="title">강의 제목</label>
                                        </th>
                                        <td>
                                            <input type="text" name="title" id="titleVal" defaultValue={title} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="spoint">수강료</label>
                                        </th>
                                        <td>
                                            <input type="text" name="spoint" id="spointVal" defaultValue={spoint} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label for="Content">강의내용</label>
                                        </th>
                                        <td>
                                            <textarea style={{ padding: '15px' }} name="contents" id="contentVal" rows="" cols="" defaultValue={content} ></textarea>
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
                                                onClick={() => handleRemoveAllThumbnails('A')}>X</button>
                                            <ul id="upload_img">
                                                {renderImages()}
                                            </ul>
                                        </td>
                                    </tr>

                                </table>
                                <div class="btn_confirm mt20" style={{ "margin-bottom": "44px", textAlign: "center" }}>
                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass"
                                        onClick={(e) => submitClick('file', e)}>저장</a>
                                    <Link to={`/SubscribeLRead/${sno}`} className="bt_ty bt_ty2 submit_ty1 saveclass">취소</Link>
                                </div>
                            </div>
                        </article>
                    </form>
                </div>
            </article>
        </section>
    );
}

export default SubscribeLUpdate;