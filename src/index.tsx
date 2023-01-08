import ReactDOM, { createRoot } from 'react-dom/client';
import App from './App';
import NewBuildingButtonContainer from './view/village/NewBuildingButtonContainer';
import NewBuildingViewContainer from './view/village/NewBuildingViewContainer';
import UpgradeIndicatorContainer from './view/village/UpgradeIndicatorContainer';

const root = ReactDOM.createRoot(
  document.getElementById('footer') as HTMLElement
);

root.render(
  <App />
);

for (let i = 1; i < 50; i++) {
  const parent = i <= 18 ?
    document.querySelector(`.buildingSlot${i} .labelLayer`)
    : document.querySelector(`.aid${i} .labelLayer`)
  if (!parent) {
    continue
  }
  const container = document.createElement('div')
  parent.parentNode?.insertBefore(container, parent)
  const root = createRoot(container)
  root.render(<UpgradeIndicatorContainer key={`upgrade-indicator-${i}`} position={i} />)
}

document.querySelectorAll('.contractNew')
  .forEach(ele => {
    const container = document.createElement('div')
    ele.after(container)
    const root = createRoot(container)
    root.render(<NewBuildingButtonContainer />)
  })

document.querySelectorAll('.buildingSlot.g0')
  .forEach(ele => {
    const positionStr = ele.getAttribute('data-aid')
    if (!positionStr)
      return
    const position = parseInt(positionStr)
    const innerHTML = ele.innerHTML
    const root = createRoot(ele)
    root.render(<NewBuildingViewContainer position={position} originalInnerHTML={innerHTML} />)
  })
