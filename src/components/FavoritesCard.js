import {useRef} from "react";
import {useDrag, useDrop} from "react-dnd";
import {Card, Image} from "react-bootstrap";

const FavoritesCard = ({id, poster, number, title, moveFav}) => {
    const fixImage = (e) => {
        e.target.src = "/images/NoPosterAvailable-crop.jpg";
    }

    const ref = useRef(null);

    const[{handlerId}, drop] = useDrop({
        accept: "favoritesCard",
        collect(monitor){
            return {
                handlerId: monitor.getHandlerId()
            };
        },
        hover(item, monitor) {
            if(!ref.current){
                return;
            }
            const dragIndex = item.number;
            const hoverIndex = number;
            if(dragIndex === hoverIndex){
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            const clientOffset = monitor.getClientOffset();

            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if(dragIndex < hoverIndex && hoverClientY < hoverMiddleY){
                return;
            }

            if(dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveFav(dragIndex, hoverIndex);

            item.number = hoverIndex;
        }
    })

    const [{isDragging}, drag] = useDrag({
        type: "favoritesCard",
        item: () => {
            return { id, number};
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
    })

    const opacity = isDragging ? 0 : 1;

    drop(drag(ref));

    return (
        <div ref={ref} data-handler-id={handlerId} style={{padding: '10px', marginBottom: "0.5rem", backgroundColor: 'white', opacity}}>
            <Card className={"favoritesCard card"}>
                <div
                    className={`favoritesNumber 
                    ${number > 9 ? "favoritesNumberTwoDigit" : "favoritesNumberOneDigit"}`}>
                    {number+1}
                </div>
                <div>
                    <Image
                        className={"card-img favoritesPoster"}
                        src={poster + "/100px250"}
                        onError={fixImage}/>
                </div>
                <div className={"favoritesTitle"}>
                    <div>{title}</div>
                </div>
            </Card>
        </div>
    );
}

export default FavoritesCard;