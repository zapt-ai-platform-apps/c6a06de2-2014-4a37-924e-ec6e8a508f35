import { createSignal, onMount, createEffect, Show, For } from 'solid-js';
import { supabase, createEvent } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [scriptInput, setScriptInput] = createSignal('');
  const [selectedImages, setSelectedImages] = createSignal([]);
  const [selectedStyle, setSelectedStyle] = createSignal('Animated');
  const [loading, setLoading] = createSignal(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = createSignal('');
  const [videoLibrary, setVideoLibrary] = createSignal([]);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.data.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const handleGenerateVideo = async () => {
    if (!scriptInput() && selectedImages().length === 0) {
      alert('Please provide a script or upload images.');
      return;
    }
    setLoading(true);
    try {
      const dataInput = {
        app_id: import.meta.env.VITE_PUBLIC_APP_ID,
        style: selectedStyle(),
        script: scriptInput(),
        images: selectedImages(), // You might need to handle image uploading separately
      };
      const result = await createEvent('generate_video', dataInput);
      setGeneratedVideoUrl(result.video_url);
      setVideoLibrary([...videoLibrary(), result]);
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                showLinks={false}
                view="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-6xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">New App</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Create a New Video</h2>
              <div class="space-y-4">
                <textarea
                  placeholder="Enter your script here..."
                  value={scriptInput()}
                  onInput={(e) => setScriptInput(e.target.value)}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  rows="6"
                ></textarea>
                <div>
                  <label class="block mb-2 font-semibold text-purple-600">Upload Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  />
                </div>
                <div>
                  <label class="block mb-2 font-semibold text-purple-600">Choose a Style</label>
                  <select
                    value={selectedStyle()}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  >
                    <option>Animated</option>
                    <option>Professional</option>
                    <option>Casual</option>
                  </select>
                </div>
                <button
                  onClick={handleGenerateVideo}
                  class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading()}
                >
                  <Show when={loading()} fallback="Generate Video">
                    Generating...
                  </Show>
                </button>
              </div>
            </div>

            <div>
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Your Videos</h2>
              <div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
                <Show when={videoLibrary().length > 0} fallback={<p>You have not created any videos yet.</p>}>
                  <For each={videoLibrary()}>
                    {(video) => (
                      <div class="bg-white p-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                        <video controls src={video.video_url} class="w-full rounded-lg mb-2"></video>
                        <div class="flex justify-between items-center">
                          <p class="font-semibold text-gray-700">{video.style} Style</p>
                          <button
                            class="text-red-500 hover:text-red-600 focus:outline-none cursor-pointer"
                            onClick={() => {
                              setVideoLibrary(videoLibrary().filter((v) => v !== video));
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </For>
                </Show>
              </div>
            </div>
          </div>

          <Show when={generatedVideoUrl()}>
            <div class="mt-8">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Generated Video</h2>
              <video controls src={generatedVideoUrl()} class="w-full rounded-lg shadow-md"></video>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default App;