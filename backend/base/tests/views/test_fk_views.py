import pytest
from django.urls import reverse
from rest_framework import status
from ..factories import MessageFactory, UserFactory, ProjectFactory, CommentFactory, PostFactory

pytestmark = pytest.mark.django_db

class TestUserProjectsView:

    def test_user_projects_returns_correct_projects(self, api_client, user_factory, project_factory):
        
        user = user_factory()
        projects = project_factory.create_batch(5, host=user)
        url = reverse('user-projects', kwargs={'user_id': user.id})

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == len(projects)
        project_ids = [project['id'] for project in response.data]
        for project in projects:
            assert project.id in project_ids

    def test_user_projects_only_returns_users_projects(self, api_client, user_factory, project_factory):
        user = user_factory()
        user_2 = user_factory()

        project_factory.create_batch(3, host=user)
        projects_2 = project_factory.create_batch(2, host=user_2)

        url = reverse('user-projects', kwargs={'user_id': user.id})

        response = api_client.get(url)

        project_ids = [project['id'] for project in response.data]
        for project in projects_2:
            assert project.id not in project_ids

    def test_user_projects_empty_returns_zero(self, api_client, user_factory):
        user = user_factory()
        url = reverse('user-projects', kwargs={'user_id': user.id})

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

class TestUserPostsView:

    def test_user_posts_returns_correct_posts(self, api_client, user_factory, post_factory):
        
        user = user_factory()
        posts = post_factory.create_batch(5, user=user)
        url = reverse('user-posts', kwargs={'user_id': user.id})

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == len(posts)
        post_ids = [post['id'] for post in response.data]
        for post in posts:
            assert post.id in post_ids

    def test_user_posts_only_returns_users_posts(self, api_client, user_factory, post_factory):
        user = user_factory()
        user_2 = user_factory()

        post_factory.create_batch(3, user=user)
        posts_2 = post_factory.create_batch(2, user=user_2)

        url = reverse('user-posts', kwargs={'user_id': user.id})

        response = api_client.get(url)

        post_ids = [post['id'] for post in response.data]
        for post in posts_2:
            assert post.id not in post_ids

    def test_user_posts_empty_returns_zero(self, api_client, user_factory):
        user = user_factory()
        url = reverse('user-posts', kwargs={'user_id': user.id})

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

class TestUserMessagesView:

    def test_user_messages_returns_correct_messages(self, api_client, user_factory, message_factory):
        
        user = user_factory()
        messages = message_factory.create_batch(5, user=user)
        url = reverse('user-messages', kwargs={'user_id': user.id})

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == len(messages)
        message_ids = [message['id'] for message in response.data]
        for message in messages:
            assert message.id in message_ids

    def test_user_messages_only_returns_users_messages(self, api_client, user_factory, message_factory):
        user = user_factory()
        user_2 = user_factory()

        message_factory.create_batch(3, user=user)
        messages_2 = message_factory.create_batch(2, user=user_2)

        url = reverse('user-messages', kwargs={'user_id': user.id})

        response = api_client.get(url)

        message_ids = [message['id'] for message in response.data]
        for message in messages_2:
            assert message.id not in message_ids

    def test_user_messages_empty_returns_zero(self, api_client, user_factory):
        user = user_factory()
        url = reverse('user-messages', kwargs={'user_id': user.id})

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

class TestUserCommentsView:

    def test_user_comments_returns_correct_comments(self, api_client, user_factory, comment_factory):
        
        user = user_factory()
        comments = comment_factory.create_batch(5, user=user)
        url = reverse('user-comments', kwargs={'user_id': user.id})

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == len(comments)
        comment_ids = [comment['id'] for comment in response.data]
        for comment in comments:
            assert comment.id in comment_ids

    def test_user_comments_only_returns_users_comments(self, api_client, user_factory, comment_factory):
        user = user_factory()
        user_2 = user_factory()

        comment_factory.create_batch(3, user=user)
        comments_2 = comment_factory.create_batch(2, user=user_2)

        url = reverse('user-comments', kwargs={'user_id': user.id})

        response = api_client.get(url)

        comment_ids = [comment['id'] for comment in response.data]
        for comment in comments_2:
            assert comment.id not in comment_ids

    def test_user_comments_empty_returns_zero(self, api_client, user_factory):
        user = user_factory()
        url = reverse('user-comments', kwargs={'user_id': user.id})

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0


        

