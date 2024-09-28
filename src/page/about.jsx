// Counter.jsx
import useStore from "../useUserStore"; // to'g'ri yo'lni qo'shing

function Counter() {
  const { count, inc } = useStore();

  return (
    <div>
      <span>{count}</span>
      <button onClick={inc}>one up</button>
    </div>
  );
}

export default Counter;
