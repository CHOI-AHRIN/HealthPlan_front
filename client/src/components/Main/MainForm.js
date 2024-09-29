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
            <ImageTextContainer imagePath={require("../../img/gif/001.gif")} altText="Background" labelText="Eat Well" />

            {/* 두 번째 이미지와 텍스트 */}
            <ImageTextContainer imagePath={require("../../img/gif/002.gif")} altText="Background" labelText="Exercise Regularly" />

            {/* 세 번째 이미지와 텍스트 */}
            <ImageTextContainer imagePath={require("../../img/gif/003.gif")} altText="Background" labelText="Workout Together" />

            {/* 하단 이미지1 */}
            <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/MainImage/001.webp`)} alt="" className="bottom-image" />
                <div className="bottom-text">
                    <h2>"다양한 운동 프로그램 제공 "</h2>
                    <br />

                    {/**사용자 개개인의 운동 목적과 체력 수준에 맞는 프로그램을 선택할 수 있음
                     * 근력 강화, 유산소 운동, 스트레칭, 요가 등 다양한 운동 종류가 포함되어, 사용자가 자신의 목표에 맞는 운동을 꾸준히 할 수 있도록 지원
                     */}
                    <br />
                    이용자 개개인의 운동 목적과 체력 수준에 맞는
                    <br />
                    프로그램을 선택할 수 있습니다.
                    <br />
                    <br />
                    근력 강화, 유산소 운동, 스트레칭, 요가 등 다양한 운동을
                    <br />
                    제공하며 이용자가 자신의 목표에 맞는 운동을
                    <br />
                    꾸준히 할 수 있도록 지원합니다.
                </div>
            </div>
            {/* 하단 이미지2 */}
            <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/MainImage/002.png`)} alt="Bottom Image2" className="bottom-image2" />
                <div className="bottom-text2">
                   <h2>"개인 맞춤형 피드백 시스템 제공"</h2> 
                    <br />
                    {/*사용자별 맞춤 운동 계획을 제공하며, 개별 체력과 운동 습관에 맞춘 피드백을 통해 더 효과적인 운동을 할 수 있도록 돕*/}
                    <br />
                    구독 서비스에 있는 전문가 1:1 티칭을 통해
                    <br />
                    개인 맞춤형 피드백 시스템을 제공합니다.
                    <br />
                    <br />
                    이용자별 맞춤 운동 계획을 제공하며,
                    <br />
                    개별 체력과 운동 습관에 맞춘 피드백을 통해
                    <br />
                    더 효과적인 운동을 할 수 있도록 돕습니다.
                </div>
            </div>
            {/* 하단 이미지3 */}
            <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/MainImage/003.png`)} alt="" className="bottom-image" />
                <div className="bottom-text">
                    <h2>"커뮤니티 기능 강화"</h2>
                    {/*운동 프로그램을 함께하는 사용자들 간의 상호작용을 촉진하기 위해 커뮤니티 기능을 강화합니다.
                    사용자는 자신의 성과를 공유하거나, 다른 사용자들과 운동 관련 정보를 교류하며 동기부여를 받을 수 있습니다. 
                    그룹 챌린지나 운동 그룹을 형성하여 함께 목표를 달성하는 등 협력적인 운동 환경을 제공합니다. */}
                    <br />
                    <br />
                    사용자들 간의 상호작용을 촉진하기 위해 
                    <br />
                    커뮤니티를 위한 공간이 있습니다.
                    <br />
                    <br />
                    이용자는 식단과 운동에 관련된 내용을 공유하거나,
                    <br />
                    다른 이용자들과 관련 정보를 교류하며 
                    <br />
                    동기부여를 받을 수 있습니다.
                    <br />
                    <br />
                   챌린지를 통해 달성한 목표를 공유하는 등
                    <br />
                    협력적인 운동 환경을 제공합니다.
                </div>
            </div>
            {/* 하단 이미지4 */}
            <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/MainImage/004.png`)} alt="Bottom Image2" className="bottom-image2" />
                <div className="bottom-text2">
                    <h2>"유연한 접근성"</h2>
                    {/* 다양한 디바이스(스마트폰, 태블릿, PC 등)를 통해 언제 어디서나 운동 프로그램에 접근할 수 있도록 지원합니다. 
                    이를 통해 시간과 장소에 구애받지 않고 운동을 지속할 수 있으며, 바쁜 일상 속에서도 효율적으로 건강을 관리할 수 있는 환경을 제공합니다. 
                    온라인, 오프라인 모두 활용 가능한 운동 프로그램을 통해 유연한 운동 경험을 제공합니다. */}
                    <br />
                    <br />
                    다양한 디바이스(스마트폰, 태블릿, PC 등)를 통해
                    <br />
                    언제 어디서나 온라인, 오프라인 모든 환경에서 
                    <br />
                    모두 활용 가능한 운동 프로그램을 통해 
                    <br />
                    유연한 운동 경험을 제공합니다.
                    <br />
                    <br />
                    이를 통해 시간과 장소에 구애받지 않고 
                    <br />
                    운동을 지속할 수 있으며,
                    <br />
                    바쁜 일상 속에서도 효율적을 건강을 관리할 수 있는
                    <br />
                    환경을 제공합니다.
                </div>
            </div>
            {/* 하단 이미지5 */}
{/*             <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/MainImage/MainImage8.png`)} alt="" className="bottom-image" />
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
            </div> */}
            {/* 하단 이미지6 */}
{/*             <div className={`bottom-image-container ${showBottomImage ? 'visible' : ''}`}>
                <img src={require(`../../img/MainImage/MainImage9.png`)} alt="" className="bottom-image2" />
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
            </div> */}
        </div>
    );
}


export default MainForm;
