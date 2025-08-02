import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { capitialize } from "../lib/utils";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-0">
      <Navbar />
      <div className="container mx-auto py-10 px-4 sm:px-8 lg:px-16">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 bg-white dark:bg-gray-950 rounded-2xl shadow-2xl p-10 border border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 tracking-tight leading-tight">
              Welcome to <span className="text-blue-500 dark:text-blue-300">Collabio</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 font-medium">
              Connect, learn, and grow with language partners from around the world.<br />
              Find friends, chat, and start your language journey today!
            </p>
            <Link to="/onboarding" className="btn btn-primary btn-lg shadow-lg transition-transform hover:scale-105">
              Get Started
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/public/i.png" alt="Collabio Hero" className="w-72 h-72 object-contain rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-800" />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center my-12">
          <div className="flex-grow border-t border-blue-200 dark:border-blue-800"></div>
          <span className="mx-4 text-lg font-semibold text-blue-700 dark:text-blue-300">Your Friends</span>
          <div className="flex-grow border-t border-blue-200 dark:border-blue-800"></div>
        </div>

        {/* Friends Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <Link to="/notifications" className="btn btn-outline btn-sm border-blue-400 text-blue-700 dark:text-blue-300">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-blue-500" />
          </div>
        ) : friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <NoFriendsFound />
            <Link to="/onboarding" className="btn btn-primary mt-6">Find Friends</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
            {friends.map((friend) => (
              <div className="transition-transform duration-300 hover:scale-105">
                <FriendCard key={friend._id} friend={friend} />
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="w-full flex items-center my-12">
          <div className="flex-grow border-t border-blue-200 dark:border-blue-800"></div>
          <span className="mx-4 text-lg font-semibold text-blue-700 dark:text-blue-300">Meet New Learners</span>
          <div className="flex-grow border-t border-blue-200 dark:border-blue-800"></div>
        </div>

        {/* Recommendations Section */}
        <section>
          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-blue-500" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-10 text-center shadow-lg animate-fade-in">
              <img src="https://illustrations.popsy.co/gray/language-learning.svg" alt="No recommendations" className="mx-auto mb-4 w-32 h-32" />
              <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">No recommendations available</h3>
              <p className="text-base-content opacity-70">Check back later for new language partners!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="card bg-white dark:bg-gray-950 border border-gray-200 dark:border-blue-900 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl"
                  >
                    <div className="card-body p-8 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="avatar size-16 rounded-full border-2 border-blue-200 dark:border-blue-800 shadow">
                          <img src={user.profilePic} alt={user.fullName} className="object-cover w-full h-full rounded-full" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-200">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)} Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)} Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>
                      {user.bio && (
                        <p className="text-sm opacity-70 text-gray-600 dark:text-gray-300">{user.bio}</p>
                      )}
                      <button
                        className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
