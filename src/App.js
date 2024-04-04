import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App({ onClick }) {
  const [newFriends, setFriend] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // const [owe, setOwe] = useState("");

  function handelShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handelAddFriend(newFriends) {
    setFriend((friends) => [...friends, newFriends]);
    setShowAddFriend(false);
  }

  function handelToSelectFriend(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handelSplitBill(value) {
    console.log(value);

    setFriend((newFriends) =>
      newFriends.map((newFriend) =>
        newFriend.id === selectedFriend.id
          ? { ...newFriend, balance: newFriend.balance + value }
          : newFriend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <ListOfFriends
          newFriends={newFriends}
          selectedFriend={selectedFriend}
          onSelectFriend={handelToSelectFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handelAddFriend} />}
        <Button onClick={handelShowAddFriend}>
          {showAddFriend ? "close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handelSplitBill}
        />
      )}
    </div>
  );
}

export default App;

function ListOfFriends({ newFriends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {newFriends.map((e) => (
        <Friend
          e={e}
          key={Friend.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ e, children, onSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === e.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={e.image} alt={e.name} />
      <h3>{e.name}</h3>

      {e.balance < 0 && (
        <p className="red">
          you owe {e.name} {Math.abs(e.balance)}$
        </p>
      )}
      {e.balance > 0 && (
        <p className="green">
          {e.name} owe you {Math.abs(e.balance)}$
        </p>
      )}
      {e.balance === 0 && <p>you and {e.name} are even</p>}

      <Button onClick={() => onSelectFriend(e)}>
        {isSelected ? "close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ children, onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImageUrl] = useState("https://i.pravatar.cc/48");

  function handelSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = {
      name,
      image,
      balance: 0,
      id: crypto.randomUUID(),
    };
    onAddFriend(newFriend);
    setName("");
    setImageUrl("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handelSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🏞 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ children, selectedFriend, onSplitBill }) {
  const [bill, setbill] = useState("");
  const [yourSpending, setYourSpending] = useState("");
  const friendSpending = bill ? bill - yourSpending : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handelSubmit(e) {
    e.preventDefault();

    if (!bill || !yourSpending) return;

    onSplitBill(whoIsPaying === "user" ? friendSpending : -yourSpending);
    // setbill("");
    // setYourSpending("");
  }

  return (
    <form className="form-split-bill" onSubmit={handelSubmit}>
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>
      <label>💰 Bill value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(Number(e.target.value))}
      />
      <label>🧍🏻‍♂️ Your expense</label>
      <input
        type="text"
        value={yourSpending}
        onChange={(e) =>
          setYourSpending(
            Number(e.target.value) > bill
              ? yourSpending
              : Number(e.target.value)
          )
        }
      />
      <label>👬 {selectedFriend.name}'s expense:</label>
      <input type="text" disabled value={friendSpending} />
      <label>🤑 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
