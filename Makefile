# 根据 package.json 版本打 annotated tag，并推送到远端。
# 推送 v* tag 到 GitHub 后，.github/workflows/release.yml 会发布 npm 并创建 GitHub Release。
#
# 用法:
#   make release              打 tag 并推送当前分支
#   make release DRY_RUN=1    预览，不执行
#
# 变量:
#   RELEASE_REMOTES   默认 origin github
#   DRY_RUN           设为 1 时只打印操作

SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c

VERSION := $(shell node -p "JSON.parse(require('node:fs').readFileSync('package.json', 'utf8')).version")
TAG := v$(VERSION)
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
RELEASE_REMOTES ?= origin github

.DEFAULT_GOAL := help

.PHONY: help release

help:
	@echo "Targets:"
	@echo "  make release              根据 package.json ($(VERSION)) 创建 $(TAG) 并推送"
	@echo "  make release DRY_RUN=1    预览，不执行 git 写操作"
	@echo
	@echo "当前分支: $(BRANCH)"
	@echo "推送远端: $(RELEASE_REMOTES)"
	@echo "推送 tag 到 GitHub 后会触发 npm publish 与 GitHub Release。"

release:
	@version="$(VERSION)"
	tag="$(TAG)"
	branch="$(BRANCH)"
	dry_run="$(DRY_RUN)"
	head_commit="$$(git rev-parse HEAD)"

	run() {
		if [[ "$$dry_run" == 1 ]]; then
			echo "DRY_RUN: $$*"
		else
			printf '+ %s\n' "$$*"
			"$$@"
		fi
	}

	if [[ -z "$$version" ]]; then
		echo "无法从 package.json 读取 version" >&2
		exit 1
	fi

	if [[ "$$branch" == "HEAD" ]]; then
		echo "当前处于 detached HEAD，请先切换到发布分支" >&2
		exit 1
	fi

	if [[ -n "$$(git status --porcelain)" ]]; then
		echo "工作区不干净，请先提交或贮藏变更：" >&2
		git status --short
		exit 1
	fi

	echo "准备发布 $$tag（分支 $$branch，$$head_commit）"

	if git rev-parse "$$tag" >/dev/null 2>&1; then
		tag_commit="$$(git rev-parse "$$tag^{}")"
		if [[ "$$tag_commit" != "$$head_commit" ]]; then
			echo "本地已有 tag $$tag，但指向 $$tag_commit，当前 HEAD 为 $$head_commit" >&2
			exit 1
		fi
		echo "本地已有 tag $$tag，跳过创建"
		create_tag=0
	else
		create_tag=1
	fi

	push_remotes=()
	for remote in $(RELEASE_REMOTES); do
		if ! git remote get-url "$$remote" >/dev/null 2>&1; then
			echo "跳过不存在的 remote: $$remote"
			continue
		fi

		run git fetch "$$remote" --tags

		remote_tag_commit="$$(git ls-remote --tags "$$remote" "$$tag^{}" | awk '{print $$1}')"
		if [[ -z "$$remote_tag_commit" ]]; then
			remote_tag_commit="$$(git ls-remote --tags "$$remote" "$$tag" | awk '{print $$1}')"
		fi

		if [[ -n "$$remote_tag_commit" ]]; then
			if [[ "$$remote_tag_commit" != "$$head_commit" ]]; then
				echo "remote $$remote 已有 tag $$tag，但指向 $$remote_tag_commit，当前 HEAD 为 $$head_commit" >&2
				exit 1
			fi
			echo "remote $$remote 已有 tag $$tag，跳过该远端"
			continue
		fi

		push_remotes+=("$$remote")
	done

	if [[ "$$create_tag" -eq 1 ]]; then
		run git tag -a "$$tag" -m "$$tag"
	fi

	if [[ "$${#push_remotes[@]}" -eq 0 ]]; then
		echo "没有需要推送的远端，$$tag 可能已经发布"
		exit 0
	fi

	for remote in "$${push_remotes[@]}"; do
		run git push "$$remote" "HEAD:$$branch"
		run git push "$$remote" "$$tag"
	done

	if [[ "$$dry_run" == 1 ]]; then
		echo "预览完成：将发布 $$tag -> $${push_remotes[*]}"
	else
		echo "已推送 $$tag -> $${push_remotes[*]}。GitHub Actions 将发布 npm 并创建 GitHub Release。"
	fi
