"use client";

import React from "react";

interface TopPageProps {
  onStartGame: () => void;
}

export default function TopPage({ onStartGame }: TopPageProps) {
  return (
    <>
      <style jsx>{`
        @keyframes shine {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .animate-shine {
          background-size: 200% 100%;
          animation: shine 3s infinite linear;
        }
        .title {
          font-size: 6rem;
        }
        .title-gradation {
          background: linear-gradient(
            to bottom,
            var(--color-html-500) 25%,
            var(--color-html-300) 50%,
            var(--color-html-500) 60%
          );
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        .title-stroke {
          -webkit-text-stroke: 0.03em white;
          text-stroke: 0.03em white;
          paint-order: stroke fill;
          font-weight: 900;

          filter: drop-shadow(0.06em 0.04em 0 black);
        }

        .rich-button {
          --press-offset: 0.2em;

          display: block;
          width: 100%;
          padding: 1rem 2rem;
          /* 上下方向グラデーション */
          background-image: linear-gradient(
            to bottom,
            var(--color-html-300) 10%,
            var(--color-html-500) 90%
          );
          background-repeat: no-repeat;
          background-position: left center;
          color: white;
          font-weight: 700;
          box-shadow:
            inset 0.05em 0.1em 0 var(--color-html-100),
            inset -0.05em -0.1em 0 var(--color-html-700),
            0 var(--press-offset) 0 var(--color-html-800);
          border: 4px solid var(--color-html-600);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          /* 文字に枠線 */
          -webkit-text-stroke: 0.2em var(--color-html-600);
          text-stroke: 0.2em var(--color-html-600);
          paint-order: stroke fill;

          font-size: 2rem;
          border-radius: 1rem;
          transition: all 0.2s ease-in-out;
          &:hover {
            /* filter: drop-shadow(0 0 0.1em var(--color-html-700)); */
          }
          &:active {
            box-shadow:
              inset 0.05em 0.1em 0.1em var(--color-html-600),
              inset 0 0 0 var(--color-html-700),
              0 0 0 var(--color-html-800);
            translate: 0 var(--press-offset);
            background-image: linear-gradient(
              to bottom,
              var(--color-html-400) 10%,
              var(--color-html-500) 90%
            );
          }
        }

        .Background {
          --size: 3rem;
          --angle: 55deg;
          --color-1: var(--color-html-100);
          --color-2: rgb(255, 255, 255, 0.3);
          background-color: var(--color-1);
          background-image:
            linear-gradient(
              var(--angle),
              var(--color-2) 25%,
              transparent 25% 75%,
              var(--color-2) 75%
            ),
            linear-gradient(
              calc(-1 * var(--angle)),
              var(--color-2) 25%,
              transparent 25% 75%,
              var(--color-2) 75%
            );
          background-size: calc(var(--size) * cos(var(--angle))) var(--size);
          background-position:
            0 0,
            calc(var(--size) * cos(var(--angle))) var(--size);
        }
      `}</style>
      <div className="Background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="title title-gradation title-stroke relative mb-4 text-9xl font-bold">
              <span className="inline-block">HTML</span>{" "}
              <span className="inline-block">大富豪</span>
            </h1>
            <p className="text-lg text-gray-600">HTMLタグでカードゲーム！</p>
            <p className="text-sm text-gray-500">
              HTMLの要素とコンテンツモデルを学びながら楽しめるカードゲームです
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onStartGame}
              className="rich-button"
              style={{ viewTransitionName: "start-button" }}
            >
              ゲームスタート
            </button>

            <div className="pt-4">
              <a
                href="https://github.com/kagankan/html-card-game"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-800"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub リポジトリ
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
