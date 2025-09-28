import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { Users, Search } from "lucide-react";


const searchUsers = async (query: string) => {
  try {
    const res = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Server returned:", res.statusText);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
};


const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-zinc-800 bg-zinc-900 flex flex-col">
      <div className="border-b border-zinc-800 w-full p-5">
        <div className="flex items-center gap-2 text-zinc-200">
          <Users className="w-6 h-6" />
          <span className="hidden lg:block font-medium">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            <div className="skeleton size-12 rounded-full bg-zinc-800" />
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2 bg-zinc-800" />
              <div className="skeleton h-3 w-16 bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, messages } =
    useChatStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<typeof users>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const chattedUsers = useMemo(() => {
    const ids = new Set<number>();
    messages.forEach((m) => {
      if (m.senderId) ids.add(m.senderId);
      if (m.receiverId) ids.add(m.receiverId);
    });
    return users.filter((u) => ids.has(u.ID));
  }, [users, messages]);


  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchUsers(searchTerm);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const displayedUsers = searchTerm.trim() ? searchResults : chattedUsers;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-zinc-800 bg-zinc-900 flex flex-col">
      <div className="border-b border-zinc-800 w-full p-5">
        <div className="flex items-center gap-2 text-zinc-200">
          <Users className="w-6 h-6" />
          <span className="hidden lg:block font-medium">Contacts</span>
        </div>

        {/* Search bar */}
        <div className="mt-3 hidden lg:flex items-center gap-2 bg-zinc-800 rounded-lg px-2 py-1">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none text-sm text-zinc-200 w-full"
          />
        </div>
      </div>

      {/* Users list */}
      <div className="overflow-y-auto w-full py-3">
        {displayedUsers.length > 0 ? (
          displayedUsers.map((user) => (
            <button
              key={user.ID}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-zinc-800 transition-colors ${
                selectedUser?.ID === user.ID ? "bg-zinc-800" : ""
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.ProfilePic || "/avatar.png"}
                  alt={user.FullName}
                  className="size-12 object-cover rounded-full"
                />
              </div>
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate text-zinc-200">{user.FullName}</div>
                <div className="text-sm text-zinc-400 truncate">{user.Email}</div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">
            {isSearching ? "Searching..." : "No contacts found"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
