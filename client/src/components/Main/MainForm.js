import React, { useState, useEffect } from 'react';

const ImageTextContainer = (props) => {
    const { imagePath, altText, labelText } = props;
    return (
        <div className="image-container">
            <img src={imagePath} alt={altText} className="mainimage" />
            <div className="maintext">
                <p>{labelText}</p>
            </div>
        </div>
    );

}

const MainForm = () => {

    const [showBottomImage, setShowBottomImage] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const bottomImageContainers = document.querySelectorAll('.bottom-image-container');

            bottomImageContainers.forEach((container, index) => {
                const distanceFromTop = container.offsetTop;
                const isVisible = scrollY > distanceFromTop - window.innerHeight / 2;

                if (isVisible) {
                    container.classList.add('visible');
                } else {
                    container.classList.remove('visible');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="maincontainer">
            {/* 첫 번째 이미지와 텍스트 */}
            <ImageTextContainer imagePath={require("../../img/gif/01.gif")} altText="Background" labelText="I'm going in a car." />

            {/* 두 번째 이미지와 텍스트 */}
            <ImageTextContainer imagePath={require("../../img/gif/02.gif")} altText="Background" labelText="I arrived at the charging station." />

            {/* 세 번째 이미지와 텍스트 */}
            <ImageTextContainer imagePath={require("../../img/gif/05.gif")} altText="Background" labelText="I charge my electric car." />

            {/* 하단 이미지1 */}
            <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/고흐/고흐0.png`)} alt="" className="bottom-image" />
                <div className="bottom-text">
                    "온실가스 감축"
                    <br />
                    <br />
                    가장 큰 환경적 이점 중 하나는
                    <br />
                    전기 자동차의 온실가스 배출 감소입니다.
                    <br />
                    휘발유나 경유를 사용하지 않아
                    <br />
                    이산화탄소와 기타 오염물질을
                    <br />
                    배출하지 않습니다.
                </div>
            </div>
            {/* 하단 이미지2 */}
            <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/고흐/고흐7.png`)} alt="Bottom Image2" className="bottom-image2" />
                <div className="bottom-text2">
                    "공기질 개선"
                    <br />
                    <br />
                    전기 자동차는 배기가스를
                    <br />
                    배출하지 않으며,
                    <br />
                    대기 질 개선에 도움이 될 수 있습니다.
                    <br />
                    깨끗한 공기는 모든 사람의
                    <br />
                    건강에 긍정적인 영향을 미칩니다.
                </div>
            </div>
            {/* 하단 이미지3 */}
            <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/고흐/고흐3.png`)} alt="" className="bottom-image" />
                <div className="bottom-text">
                    "자원 절약"
                    <br />
                    <br />
                    재생 가능한 에너지원과
                    <br />
                    혁신적인 배터리 기술 덕분에
                    <br />
                    에너지를 보다 효율적으로 사용하고
                    <br />
                    에너지를 절약합니다.
                    <br />
                    이를 통해 에너지 자원 소비를 줄이고
                    <br />
                    환경에 대한 부정적인 영향을
                    <br />
                    최소화합니다.
                </div>
            </div>
            {/* 하단 이미지4 */}
            <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/고흐/고흐1.png`)} alt="Bottom Image2" className="bottom-image2" />
                <div className="bottom-text2">
                    "소음공해 감소"
                    <br />
                    <br />
                    전기모터를 사용하여 운행 시
                    <br />
                    소음이 거의 발생하지 않습니다.
                    <br />
                    이는 도시 및 주거 지역의
                    <br />
                    소음 공해를 크게 줄이고
                    <br />
                    거주자의 편안함을 향상시킵니다.
                </div>
            </div>
            {/* 하단 이미지5 */}
            <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/고흐/고흐8.png`)} alt="" className="bottom-image" />
                <div className="bottom-text">
                    "에너지 효율성"
                    <br />
                    <br />
                    전기 자동차는 내연기관 자동차보다
                    <br />
                    에너지 효율이 훨씬 높습니다
                    <br />
                    전기 자동차는 전기로 움직이며
                    <br />
                    전기 모터는 에너지를
                    <br />
                    더 효율적으로 사용합니다.
                    <br />
                    이를 통해 더 멀리 이동할 수 있고
                    <br />
                    에너지를 덜 사용할 수 있습니다.
                </div>
            </div>
            {/* 하단 이미지6 */}
            <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/고흐/고흐9.png`)} alt="" className="bottom-image2" />
                <div className="bottom-text2">
                    "지속가능한 미래"
                    <br />
                    <br />
                    환경보호는 현재뿐만 아니라
                    <br />
                    미래에도 중요한 과제입니다.
                    <br />
                    전기차 시장은 기술 혁신과 함께
                    <br />
                    더욱 친환경적인 모빌리티로
                    <br />
                    지속적으로 성장, 발전할 것으로 예상됩니다.
                </div>
            </div>
        </div>
    );
}


export default MainForm;
